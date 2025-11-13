import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, File, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250MB
const ACCEPTED_FILE_TYPES = {
  // Images
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.psd', '.ai'],
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  // Design files
  'application/postscript': ['.eps'],
  'application/illustrator': ['.ai'],
  // Text
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
};

interface AttachmentUploadProps {
  componentId?: string;
  timelineEventId?: string;
  onUploadComplete: () => void;
}

export const AttachmentUpload = ({ componentId, timelineEventId, onUploadComplete }: AttachmentUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [usageContext, setUsageContext] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 250MB limit. Selected file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (!componentId && !timelineEventId) {
      setError('Please link this attachment to a component or timeline event');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const sanitizedName = selectedFile.name
        .replace(/[^\w\s.-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      const fileName = `${timestamp}-${sanitizedName}`;
      const folder = componentId ? `components/${componentId}` : `timeline/${timelineEventId}`;
      const filePath = `${folder}/${fileName}`;

      // Upload via Edge Function for server-side validation
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('bucket', 'brand-story-assets');
      formData.append('filePath', filePath);
      formData.append('maxSizeMB', '250');

      const { data: uploadData, error: uploadError } = await supabase.functions.invoke('validate-upload', {
        body: formData,
      });

      if (uploadError) throw uploadError;
      if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

      // Insert record into database
      const assetType = selectedFile.type.startsWith('image/') ? 'image' : 'document';
      const { error: dbError } = await supabase
        .from('brand_story_assets')
        .insert({
          component_id: componentId || null,
          timeline_event_id: timelineEventId || null,
          asset_type: assetType,
          file_name: selectedFile.name,
          file_path: uploadData.path,
          file_size: uploadData.fileSize,
          mime_type: uploadData.mimeType,
          public_url: uploadData.publicUrl,
          description: description || null,
          usage_context: usageContext || null,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (dbError) throw dbError;

      toast.success("File uploaded successfully");
      setSelectedFile(null);
      setDescription('');
      setUsageContext('');
      
      onUploadComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      toast.error(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium mb-2">
            {isDragActive ? 'Drop file here' : 'Drag & drop a file here, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports images, PDFs, Word, Excel, PowerPoint, and design files up to 250MB
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this file"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage">Usage Context (optional)</Label>
            <Textarea
              id="usage"
              value={usageContext}
              onChange={(e) => setUsageContext(e.target.value)}
              placeholder="How this file is used in the brand story"
              rows={3}
              disabled={uploading}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={removeFile}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
