import { useState } from 'react';
import { useArtworks } from '@/hooks/useArtworks';
import { ArtworkStats } from '@/components/artworks/ArtworkStats';
import { ArtworkTableView } from '@/components/artworks/ArtworkTableView';
import { CreateArtworkDialog } from '@/components/artworks/CreateArtworkDialog';
import { EditArtworkDialog } from '@/components/artworks/EditArtworkDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  brand?: {
    id: string;
    brand_name: string;
    partner?: {
      id: string;
      partner_name: string;
    };
  } | null;
  created_by_profile?: {
    full_name: string | null;
    email: string;
  } | null;
};

export default function ArtworkCatalog() {
  const [search, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const { data: artworks, isLoading } = useArtworks({ search });

  const handleView = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setEditDialogOpen(true);
  };

  const handleEdit = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setEditDialogOpen(true);
  };

  const handleArchive = (artwork: Artwork) => {
    // Archive mutation is handled in the card component
    console.log('Archive:', artwork);
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artwork Catalog</h1>
          <p className="text-muted-foreground">
            Manage your artwork collection and ASC codes
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Artwork
        </Button>
      </div>

      {/* Stats */}
      <ArtworkStats />

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, artist, or ASC code..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Artwork Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <ArtworkTableView
          artworks={artworks || []}
          onView={handleView}
          onEdit={handleEdit}
          onArchive={handleArchive}
        />
      )}

      {/* Dialogs */}
      <CreateArtworkDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditArtworkDialog
        artwork={selectedArtwork}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
