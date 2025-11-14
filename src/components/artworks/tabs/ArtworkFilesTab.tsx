import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArtworkFileUpload } from "@/components/artworks/ArtworkFileUpload";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadedFile } from "@/hooks/useArtworkFileUpload";

interface ArtworkFilesTabProps {
  artworkId: string;
}

export function ArtworkFilesTab({ artworkId }: ArtworkFilesTabProps) {
  const { data: files, isLoading } = useQuery({
    queryKey: ['artwork-files', artworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artwork_files')
        .select('*')
        .eq('artwork_id', artworkId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Transform to UploadedFile format with public URLs
      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('brand-assets')
            .getPublicUrl(file.file_path);

          return {
            id: file.id,
            file_name: file.file_name,
            file_path: file.file_path,
            file_size: file.file_size || 0,
            mime_type: file.mime_type || 'application/octet-stream',
            is_primary: file.is_primary || false,
            tags: file.tags || { structured: {}, custom: [], matches_variants: {} },
            print_specifications: file.print_specifications || {},
            url: urlData.publicUrl,
          } as UploadedFile;
        })
      );

      return filesWithUrls;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artwork Files</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <ArtworkFileUpload 
            artworkId={artworkId} 
            existingFiles={files || []}
          />
        )}
      </CardContent>
    </Card>
  );
}
