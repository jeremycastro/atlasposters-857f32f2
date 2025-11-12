import { useState } from 'react';
import { Database } from '@/integrations/supabase/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Edit, Archive, Calendar, Tag, Ruler, Palette } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useArtworkMutations } from '@/hooks/useArtworkMutations';
import { ArtworkFileUpload } from './ArtworkFileUpload';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type Artwork = Database['public']['Tables']['artworks']['Row'];

interface ArtworkDetailDialogProps {
  artwork: Artwork | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (artwork: Artwork) => void;
}

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-primary text-primary-foreground',
  archived: 'bg-secondary text-secondary-foreground',
  discontinued: 'bg-destructive text-destructive-foreground',
};

export const ArtworkDetailDialog = ({
  artwork,
  open,
  onOpenChange,
  onEdit,
}: ArtworkDetailDialogProps) => {
  const { archiveArtwork } = useArtworkMutations();
  const [isArchiving, setIsArchiving] = useState(false);

  // Fetch artwork files
  const { data: artworkFiles = [] } = useQuery({
    queryKey: ['artwork-files', artwork?.id],
    queryFn: async () => {
      if (!artwork?.id) return [];
      
      const { data, error } = await supabase
        .from('artwork_files')
        .select('*')
        .eq('artwork_id', artwork.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;

      // Add public URLs to files
      return data.map(file => ({
        ...file,
        url: supabase.storage.from('brand-assets').getPublicUrl(file.file_path).data.publicUrl,
      }));
    },
    enabled: !!artwork?.id && open,
  });

  if (!artwork) return null;

  const copyAscCode = () => {
    navigator.clipboard.writeText(artwork.asc_code);
    toast({
      title: 'Copied!',
      description: 'ASC code copied to clipboard',
    });
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await archiveArtwork.mutateAsync(artwork.id);
      onOpenChange(false);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{artwork.title}</DialogTitle>
              <DialogDescription className="text-base">
                by {artwork.artist_name}
              </DialogDescription>
            </div>
            <Badge className={statusColors[artwork.status as keyof typeof statusColors]}>
              {artwork.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-2 bg-muted p-4 rounded-lg flex-shrink-0">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">ASC Code</p>
            <p className="text-2xl font-mono font-bold">{artwork.asc_code}</p>
          </div>
          <Button variant="outline" size="icon" onClick={copyAscCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="details" className="w-full flex flex-col flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="files">Files ({artworkFiles.length})</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 overflow-y-auto flex-1">
            {artwork.description && (
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{artwork.description}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {artwork.art_medium && (
                <div className="flex items-start gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Art Medium</p>
                    <p className="text-sm font-medium">{artwork.art_medium}</p>
                  </div>
                </div>
              )}

              {artwork.year_created && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Year Created</p>
                    <p className="text-sm font-medium">{artwork.year_created}</p>
                  </div>
                </div>
              )}

              {artwork.original_dimensions && (
                <div className="flex items-start gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Dimensions</p>
                    <p className="text-sm font-medium">{artwork.original_dimensions}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Created Date</p>
                  <p className="text-sm font-medium">
                    {format(new Date(artwork.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {artwork.tags && artwork.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Tags</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {artwork.is_exclusive && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium">Exclusive Artwork</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This artwork has exclusive licensing rights
                </p>
                {(artwork.rights_start_date || artwork.rights_end_date) && (
                  <div className="flex gap-4 mt-2 text-xs">
                    {artwork.rights_start_date && (
                      <div>
                        <span className="text-muted-foreground">Start: </span>
                        <span className="font-medium">
                          {format(new Date(artwork.rights_start_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    {artwork.rights_end_date && (
                      <div>
                        <span className="text-muted-foreground">End: </span>
                        <span className="font-medium">
                          {format(new Date(artwork.rights_end_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="files" className="space-y-4 overflow-y-auto flex-1">
            <ArtworkFileUpload
              artworkId={artwork.id}
              existingFiles={artworkFiles}
            />
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4 overflow-y-auto flex-1">
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Artwork ID</p>
                <p className="text-sm font-mono">{artwork.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sequence Number</p>
                <p className="text-sm font-mono">{artwork.sequence_number}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="text-sm">
                  {format(new Date(artwork.created_at), 'PPpp')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm">
                  {format(new Date(artwork.updated_at), 'PPpp')}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t flex-shrink-0">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit(artwork)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {artwork.status !== 'archived' && (
              <Button
                variant="outline"
                onClick={handleArchive}
                disabled={isArchiving}
              >
                <Archive className="mr-2 h-4 w-4" />
                {isArchiving ? 'Archiving...' : 'Archive'}
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
