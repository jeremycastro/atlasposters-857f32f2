import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBrandAssetUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      brandId, 
      files 
    }: { 
      brandId: string; 
      files: File[] 
    }) => {
      const uploadPromises = files.map(async (file) => {
        // Create unique filename with timestamp
        const fileExt = file.name.split('.').pop();
        const fileName = `${brandId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to storage
        const { data, error } = await supabase.storage
          .from('brand-assets')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

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
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      return uploadedFiles;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success(`Successfully uploaded ${data.length} file${data.length > 1 ? 's' : ''}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload files: ${error.message}`);
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
      toast.error(`Failed to delete file: ${error.message}`);
    },
  });
};

export const useListBrandAssets = () => {
  return useMutation({
    mutationFn: async (brandId: string) => {
      const { data, error } = await supabase.storage
        .from('brand-assets')
        .list(brandId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      // Get public URLs for all files
      const filesWithUrls = data.map((file) => {
        const { data: { publicUrl } } = supabase.storage
          .from('brand-assets')
          .getPublicUrl(`${brandId}/${file.name}`);

        return {
          ...file,
          publicUrl,
          fullPath: `${brandId}/${file.name}`,
        };
      });

      return filesWithUrls;
    },
  });
};
