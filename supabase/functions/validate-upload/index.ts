import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// File type validation using magic bytes (file signatures)
const validateFileSignature = (buffer: Uint8Array, mimeType: string): boolean => {
  const signatures: Record<string, number[][]> = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]],
    'image/gif': [[0x47, 0x49, 0x46, 0x38]],
    'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
    'application/msword': [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4B, 0x03, 0x04]],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [[0x50, 0x4B, 0x03, 0x04]],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': [[0x50, 0x4B, 0x03, 0x04]],
  }

  const expectedSignatures = signatures[mimeType]
  if (!expectedSignatures) {
    // Allow files without known signatures (like SVG, text files)
    return true
  }

  return expectedSignatures.some(signature => {
    return signature.every((byte, index) => buffer[index] === byte)
  })
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string
    const filePath = formData.get('filePath') as string
    const maxSizeMB = parseInt(formData.get('maxSizeMB') as string || '250')

    if (!file || !bucket || !filePath) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, bucket, or filePath' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Validating upload: ${file.name} (${file.type}) to ${bucket}/${filePath}`)

    const MAX_FILE_SIZE = maxSizeMB * 1024 * 1024
    const ALLOWED_MIME_TYPES = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/tiff',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'text/plain',
      'application/postscript', // AI files
      'image/vnd.adobe.photoshop', // PSD
      'application/x-photoshop', // PSD
    ]

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error(`File too large: ${file.size} bytes (max: ${MAX_FILE_SIZE})`)
      return new Response(
        JSON.stringify({ 
          error: `File too large. Maximum size is ${maxSizeMB}MB, file is ${(file.size / 1024 / 1024).toFixed(1)}MB` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      console.error(`Invalid MIME type: ${file.type}`)
      return new Response(
        JSON.stringify({ error: `Unsupported file type: ${file.type}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Read file content for signature validation
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    
    // Validate file signature (magic bytes)
    if (!validateFileSignature(buffer, file.type)) {
      console.error(`File signature mismatch for type: ${file.type}`)
      return new Response(
        JSON.stringify({ error: 'File content does not match declared type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`File validation passed: ${file.name}`)

    // Create Supabase client with service role for upload
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upload to storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return new Response(
        JSON.stringify({ error: `Upload failed: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log(`Upload successful: ${filePath}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        path: data.path,
        publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Error in validate-upload:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload validation failed'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
