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
    printSpecifications?: Record<string, any>
  ): Promise<UploadedFile | null> => {
    try {
      setUploading(true);
      setProgress(0);

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${artworkId}/${fileName}`;

      setProgress(25);

      // Upload via Edge Function for server-side validation
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'brand-assets');
      formData.append('filePath', filePath);
      formData.append('maxSizeMB', '250');

      const { data: uploadData, error: uploadError } = await supabase.functions.invoke('validate-upload', {
        body: formData,
      });

      if (uploadError) throw uploadError;
      if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

      setProgress(75);

      // Save file metadata to database
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
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('brand-assets')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('artwork_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      toast({
        title: 'File deleted',
        description: 'File has been removed',
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
