import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnifiedTagSelector } from "@/components/tags/UnifiedTagSelector";
import { useEntityTags } from "@/hooks/useTags";
import { TagPill } from "@/components/tags/TagPill";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Info, ArrowDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BrandTagManagerProps {
  brandId: string;
  brandName: string;
}

export const BrandTagManager = ({ brandId, brandName }: BrandTagManagerProps) => {
  // Fetch brand tags
  const { data: brandTags } = useEntityTags('brand', brandId);
  
  // Group tags by category
  const tagsByCategory = brandTags?.reduce((acc, tag) => {
    if (!acc[tag.category_name]) {
      acc[tag.category_name] = [];
    }
    acc[tag.category_name].push(tag);
    return acc;
  }, {} as Record<string, typeof brandTags>);

  // Count artworks under this brand
  const { data: artworkCount } = useQuery({
    queryKey: ['brand-artwork-count', brandId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId);
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch sample artworks that will inherit these tags
  const { data: sampleArtworks } = useQuery({
    queryKey: ['brand-sample-artworks', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('id, title, asc_code')
        .eq('brand_id', brandId)
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!artworkCount && artworkCount > 0,
  });

  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Tags added to this brand will automatically be inherited by all {artworkCount || 0} artwork{artworkCount !== 1 ? 's' : ''} under <strong>{brandName}</strong>. 
          Inherited tags appear with a dashed border and cannot be removed from individual artworks.
        </AlertDescription>
      </Alert>

      {/* Current Brand Tags */}
      {brandTags && brandTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Brand Tags</CardTitle>
            <CardDescription>
              These tags are applied to the brand and inherited by all artworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(tagsByCategory || {}).map(([categoryName, tags]) => (
                <div key={categoryName} className="space-y-1">
                  <div className="text-xs text-muted-foreground font-medium">
                    {categoryName}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <TagPill
                        key={tag.tag_id}
                        tag={{
                          display_name: tag.tag_name,
                          category_name: tag.category_name,
                          source: tag.source,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inheritance Preview */}
      {artworkCount && artworkCount > 0 && brandTags && brandTags.length > 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Tag Inheritance</CardTitle>
            </div>
            <CardDescription>
              {artworkCount} artwork{artworkCount !== 1 ? 's' : ''} will inherit these tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleArtworks?.map((artwork) => (
                <div key={artwork.id} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="font-mono text-xs">
                    {artwork.asc_code}
                  </Badge>
                  <span className="text-muted-foreground">{artwork.title}</span>
                </div>
              ))}
              {artworkCount > 5 && (
                <p className="text-xs text-muted-foreground pt-2">
                  + {artworkCount - 5} more artwork{artworkCount - 5 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tag Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manage Brand Tags</CardTitle>
          <CardDescription>
            Add or remove tags for this brand. Changes will automatically apply to all artworks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnifiedTagSelector
            entityType="brand"
            entityId={brandId}
            scope="brand"
          />
        </CardContent>
      </Card>
    </div>
  );
};
