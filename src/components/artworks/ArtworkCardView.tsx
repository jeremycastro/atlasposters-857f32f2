import { Database } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical, Edit, Archive, Image, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  partner_profile?: {
    full_name: string | null;
    email: string;
    partner_company_name: string | null;
  };
};

interface ArtworkCardViewProps {
  artworks: Artwork[];
  onView: (artwork: Artwork) => void;
  onEdit: (artwork: Artwork) => void;
  onArchive: (artwork: Artwork) => void;
}

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-primary text-primary-foreground',
  archived: 'bg-secondary text-secondary-foreground',
  discontinued: 'bg-destructive text-destructive-foreground',
};

export const ArtworkCardView = ({
  artworks,
  onView,
  onEdit,
  onArchive,
}: ArtworkCardViewProps) => {
  const getThumbnailUrl = (artwork: Artwork & { artwork_files?: any[] }) => {
    if (!artwork.artwork_files || artwork.artwork_files.length === 0) return null;

    // Try to find thumbnails first (prefer medium for card view)
    const thumbnailMedium = artwork.artwork_files.find(
      (f: any) => f.file_type === 'thumbnail' && f.metadata?.variant === 'medium'
    );
    const thumbnailSmall = artwork.artwork_files.find(
      (f: any) => f.file_type === 'thumbnail' && f.metadata?.variant === 'small'
    );
    const thumbnailLarge = artwork.artwork_files.find(
      (f: any) => f.file_type === 'thumbnail' && f.metadata?.variant === 'large'
    );
    
    // Look for primary file first, then any image file as fallback
    const primaryImage = artwork.artwork_files.find((f: any) => f.is_primary);
    const fallbackImage = artwork.artwork_files.find((f: any) => 
      f.mime_type?.startsWith('image/')
    );
    
    // Prefer medium thumbnail for card view
    const file = thumbnailMedium || thumbnailSmall || thumbnailLarge || primaryImage || fallbackImage;
    if (!file) return null;

    const { data } = supabase.storage.from("brand-assets").getPublicUrl(file.file_path);
    return data.publicUrl;
  };

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <Image className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold">No artworks</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating a new artwork.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork) => (
        <Card key={artwork.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-0 pb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {artwork.asc_code}
                  </Badge>
                  <Badge className={statusColors[artwork.status as keyof typeof statusColors]}>
                    {artwork.status}
                  </Badge>
                </div>
                <h3 className="font-semibold line-clamp-1">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {artwork.artist_name}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(artwork)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(artwork)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {artwork.status !== 'archived' && (
                    <DropdownMenuItem onClick={() => onArchive(artwork)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {getThumbnailUrl(artwork as any) ? (
              <div className="aspect-video bg-muted rounded-md overflow-hidden mb-4">
                <img
                  src={getThumbnailUrl(artwork as any) || ''}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                <Image className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            {artwork.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {artwork.description}
              </p>
            )}

            <div className="space-y-2 text-xs text-muted-foreground">
              {artwork.partner_profile?.partner_company_name && (
                <div className="flex items-center gap-2 text-xs">
                  <Building2 className="h-3 w-3" />
                  <span className="font-medium">{artwork.partner_profile.partner_company_name}</span>
                </div>
              )}
              {artwork.art_medium && (
                <div className="flex justify-between">
                  <span>Medium:</span>
                  <span className="font-medium">{artwork.art_medium}</span>
                </div>
              )}
              {artwork.year_created && (
                <div className="flex justify-between">
                  <span>Year:</span>
                  <span className="font-medium">{artwork.year_created}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-medium">
                  {format(new Date(artwork.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            {artwork.tags && artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {artwork.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {artwork.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{artwork.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
