import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBrandAssetUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      brandId, 
      files,
      onProgress
    }: { 
      brandId: string; 
      files: File[];
      onProgress?: (fileName: string, progress: number, uploadedMB: number, totalMB: number) => void;
    }) => {
      if (!brandId) {
        throw new Error("Brand ID is required for upload");
      }

      if (!files || files.length === 0) {
        throw new Error("No files provided for upload");
      }

      console.log(`Starting upload of ${files.length} file(s) to brand ${brandId}`);

      const uploadPromises = files.map(async (file, index) => {
        try {
          console.log(`Uploading file ${index + 1}/${files.length}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
          
          const totalMB = file.size / 1024 / 1024;
          
          // Simulate progress for small files, real progress for larger ones
          if (onProgress) {
            onProgress(file.name, 0, 0, totalMB);
          }
          
          // Sanitize filename: remove special characters and spaces
          const sanitizedName = file.name
            .replace(/[^\w\s.-]/g, '') // Remove special chars except spaces, dots, dashes
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/-+/g, '-'); // Replace multiple dashes with single dash
          
          const fileName = `${brandId}/${Date.now()}-${sanitizedName}`;

          // Upload to storage
          const { data, error } = await supabase.storage
            .from('brand-assets')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            if (onProgress) {
              onProgress(file.name, -1, 0, totalMB); // -1 indicates error
            }
            throw new Error(`Failed to upload ${file.name}: ${error.message}`);
          }

          // Report 100% completion
          if (onProgress) {
            onProgress(file.name, 100, totalMB, totalMB);
          }
          
          console.log(`Successfully uploaded: ${file.name}`);

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('brand-assets')
            .getPublicUrl(fileName);

          return {
            path: data.path,
            publicUrl,
            fileName: file.name,
            size: file.size,
            mimeType: file.type,
          };
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          throw error;
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      console.log(`Successfully uploaded ${uploadedFiles.length} file(s)`);
      return uploadedFiles;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success(`Successfully uploaded ${data.length} file${data.length > 1 ? 's' : ''}`);
    },
    onError: (error: Error) => {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`, {
        duration: Infinity,
        action: {
          label: "Copy",
          onClick: () => {
            navigator.clipboard.writeText(error.message);
            toast.success("Error copied to clipboard");
          },
        },
        dismissible: true,
      });
    },
  });
};

export const useDeleteBrandAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filePath: string) => {
      const { error } = await supabase.storage
        .from('brand-assets')
        .remove([filePath]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("File deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete file: ${error.message}`, {
        duration: Infinity,
        action: {
          label: "Copy",
          onClick: () => {
            navigator.clipboard.writeText(error.message);
            toast.success("Error copied to clipboard");
          },
        },
        dismissible: true,
      });
    },
  });
};

export const useListBrandAssets = () => {
  return useMutation({
    mutationFn: async (brandId: string) => {
      console.log(`Listing assets for brand: ${brandId}`);
      
      const { data, error } = await supabase.storage
        .from('brand-assets')
        .list(brandId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error("Error listing assets:", error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} assets`, data);

      // Get public URLs and signed URLs for all files
      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const fullPath = `${brandId}/${file.name}`;
          
          const { data: { publicUrl } } = supabase.storage
            .from('brand-assets')
            .getPublicUrl(fullPath);

          return {
            ...file,
            publicUrl,
            fullPath,
          };
        })
      );

      return filesWithUrls;
    },
  });
};
