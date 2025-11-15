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
  // Fetch artwork ASC code for validation
  const { data: artwork } = useQuery({
    queryKey: ['artwork-asc', artworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('asc_code')
        .eq('id', artworkId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch all files (original and thumbnails)
  const { data: files, isLoading } = useQuery({
    queryKey: ['artwork-files', artworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artwork_files')
        .select('*')
        .eq('artwork_id', artworkId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Separate originals and thumbnails
      const originalFiles = data.filter(f => f.file_type === 'original');
      const thumbnailFiles = data.filter(f => f.file_type === 'thumbnail');

      // Group thumbnails by parent original file
      const thumbnailsByOriginal = new Map<string, any[]>();
      
      thumbnailFiles.forEach((thumb) => {
        // Extract the base name by removing the variant suffix
        // e.g., "image_large.jpg" -> "image.jpg"
        const match = thumb.file_name.match(/^(.+)_(small|medium|large)(\.[^.]+)$/);
        if (match) {
          const baseName = match[1] + match[3];
          if (!thumbnailsByOriginal.has(baseName)) {
            thumbnailsByOriginal.set(baseName, []);
          }
          thumbnailsByOriginal.get(baseName)!.push(thumb);
        }
      });

      // Transform original files to include public URLs and associated thumbnails
      const filesWithUrls = await Promise.all(
        originalFiles.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('brand-assets')
            .getPublicUrl(file.file_path);

          // Get thumbnails for this file
          const associatedThumbnails = thumbnailsByOriginal.get(file.file_name) || [];
          const thumbnailsWithUrls = associatedThumbnails.map(thumb => {
            const { data: thumbUrlData } = supabase.storage
              .from('brand-assets')
              .getPublicUrl(thumb.file_path);
            
            return {
              id: thumb.id,
              file_name: thumb.file_name,
              file_path: thumb.file_path,
              file_size: thumb.file_size || 0,
              url: thumbUrlData.publicUrl,
            };
          });

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
            thumbnails: thumbnailsWithUrls,
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
            artworkAscCode={artwork?.asc_code}
            existingFiles={files || []}
          />
        )}
      </CardContent>
    </Card>
  );
}
