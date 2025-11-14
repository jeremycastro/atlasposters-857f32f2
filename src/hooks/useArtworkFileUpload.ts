import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_primary: boolean;
  url: string;
  tags?: {
    structured: Record<string, string[]>;
    custom: string[];
    matches_variants: Record<string, string[]>;
  };
  print_specifications?: Record<string, any>;
  version_number?: number;
  is_latest?: boolean;
}

// Utility function to extract ASC code from filename
// Expected format: {ASC}-{TYPE}(-{VAR1})?(-{VAR2})?(-{VAR3})?[_\.]
// Example: 11T003-PST-01_print.jpg → 11T003
const extractAscFromFilename = (filename: string): string | null => {
  const match = filename.match(/^([0-9]{2}[A-Z][0-9]{3})-/i);
  return match ? match[1].toUpperCase() : null;
};

export const useArtworkFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File,
    artworkId: string,
    isPrimary: boolean = false,
    tags?: {
      structured: Record<string, string[]>;
      custom: string[];
      matches_variants: Record<string, string[]>;
    },
    printSpecifications?: Record<string, any>,
    artworkAscCode?: string
  ): Promise<UploadedFile | null> => {
    try {
      setUploading(true);
      setProgress(0);

      // Validate ASC code if provided
      if (artworkAscCode) {
        const fileAsc = extractAscFromFilename(file.name);
        if (fileAsc && fileAsc !== artworkAscCode.toUpperCase()) {
          toast({
            title: "⚠️ ASC Mismatch Detected",
            description: `File ASC "${fileAsc}" doesn't match artwork ASC "${artworkAscCode}". You may have uploaded this to the wrong artwork.`,
            variant: "destructive",
            duration: 8000,
          });
        }
      }

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${artworkId}/${fileName}`;

      const isLargeFile = file.size > 100 * 1024 * 1024; // 100MB threshold

      let uploadData: any;

      if (isLargeFile) {
        // For large files (>100MB), upload directly to Supabase storage to avoid edge function memory limits
        console.log(`Large file detected (${(file.size / 1024 / 1024).toFixed(1)}MB), using direct upload`);
        
        setProgress(5);
        
        const { data, error: uploadError } = await supabase.storage
          .from('brand-assets')
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        setProgress(90);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('brand-assets')
          .getPublicUrl(filePath);

        uploadData = {
          success: true,
          path: filePath,
          publicUrl,
          fileSize: file.size,
          mimeType: file.type,
          thumbnails: [], // No thumbnails for large files
        };

        setProgress(95);
      } else {
        // For smaller files, use edge function for validation and thumbnail generation
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'brand-assets');
        formData.append('filePath', filePath);
        formData.append('maxSizeMB', '250');

        // Use XMLHttpRequest for progress tracking
        uploadData = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 90); // Reserve 90% for upload
            setProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.error || 'Upload failed'));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

          xhr.open('POST', `${supabaseUrl}/functions/v1/validate-upload`);
          xhr.setRequestHeader('Authorization', `Bearer ${supabaseAnonKey}`);
          xhr.setRequestHeader('apikey', supabaseAnonKey);
          xhr.send(formData);
        });

        if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

        setProgress(95);
      }

      // Save file metadata to database
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      const { data: fileRecord, error: dbError } = await supabase
        .from('artwork_files')
        .insert({
          artwork_id: artworkId,
          file_name: file.name,
          file_path: uploadData.path,
          file_type: 'original',
          file_size: uploadData.fileSize,
          mime_type: uploadData.mimeType,
          is_primary: isPrimary,
          tags: tags || {
            structured: {},
            custom: [],
            matches_variants: {},
          },
          print_specifications: printSpecifications || {},
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Insert thumbnail records if they were generated
      if (uploadData.thumbnails && uploadData.thumbnails.length > 0) {
        console.log(`Saving ${uploadData.thumbnails.length} thumbnail records...`);
        
        const thumbnailRecords = uploadData.thumbnails.map((thumb: any) => ({
          artwork_id: artworkId,
          file_name: `${file.name}_${thumb.variant}`,
          file_path: thumb.path,
          file_type: "thumbnail",
          file_size: thumb.size,
          mime_type: "image/jpeg",
          is_primary: false,
          is_latest: true,
          metadata: {
            variant: thumb.variant,
            original_file_id: fileRecord.id,
            generated_at: new Date().toISOString(),
          },
        }));

        const { error: thumbDbError } = await supabase
          .from("artwork_files")
          .insert(thumbnailRecords);

        if (thumbDbError) {
          console.error("Error saving thumbnail records:", thumbDbError);
          // Don't fail the upload if thumbnails can't be saved
        } else {
          console.log(`Successfully saved ${thumbnailRecords.length} thumbnail records`);
        }
      }

      setProgress(100);

      toast({
        title: 'Upload successful',
        description: `${file.name} has been uploaded`,
      });

      return {
        id: fileRecord.id,
        file_name: fileRecord.file_name,
        file_path: fileRecord.file_path,
        file_size: fileRecord.file_size,
        mime_type: fileRecord.mime_type,
        is_primary: fileRecord.is_primary,
        url: uploadData.publicUrl,
        tags: fileRecord.tags as any,
        print_specifications: fileRecord.print_specifications as any,
        version_number: fileRecord.version_number,
        is_latest: fileRecord.is_latest,
      };
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (fileId: string, filePath: string) => {
    try {
      // Find all thumbnails associated with this original file
      const { data: thumbnails, error: queryError } = await supabase
        .from('artwork_files')
        .select('id, file_path')
        .eq('file_type', 'thumbnail')
        .filter('metadata->>original_file_id', 'eq', fileId);

      if (queryError) throw queryError;

      // Delete thumbnails from storage
      if (thumbnails && thumbnails.length > 0) {
        const thumbnailPaths = thumbnails.map(t => t.file_path);
        const { error: thumbnailStorageError } = await supabase.storage
          .from('brand-assets')
          .remove(thumbnailPaths);

        if (thumbnailStorageError) {
          console.warn('Failed to delete some thumbnails from storage:', thumbnailStorageError);
        }

        // Delete thumbnails from database
        const { error: thumbnailDbError } = await supabase
          .from('artwork_files')
          .delete()
          .in('id', thumbnails.map(t => t.id));

        if (thumbnailDbError) {
          console.warn('Failed to delete some thumbnails from database:', thumbnailDbError);
        }
      }

      // Delete original file from storage
      const { error: storageError } = await supabase.storage
        .from('brand-assets')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete original file from database
      const { error: dbError } = await supabase
        .from('artwork_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      toast({
        title: 'File deleted',
        description: thumbnails && thumbnails.length > 0 
          ? `File and ${thumbnails.length} thumbnail(s) removed`
          : 'File has been removed',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress,
  };
};
