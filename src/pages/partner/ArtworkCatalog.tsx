import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtworks } from '@/hooks/useArtworks';
import { useArtworkMutations } from '@/hooks/useArtworkMutations';
import { ArtworkStats } from '@/components/artworks/ArtworkStats';
import { ArtworkTableView } from '@/components/artworks/ArtworkTableView';
import { CreateArtworkDialog } from '@/components/artworks/CreateArtworkDialog';
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const { data: artworks, isLoading } = useArtworks({ 
    search,
    status: showArchived ? undefined : ['active', 'draft']
  });
  const { archiveArtwork } = useArtworkMutations();

  const handleView = (artwork: Artwork) => {
    navigate(`/admin/artworks/${artwork.id}`);
  };

  const handleEdit = (artwork: Artwork) => {
    navigate(`/admin/artworks/${artwork.id}`);
  };

  const handleArchive = (artwork: Artwork) => {
    archiveArtwork.mutate(artwork.id);
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
          showArchived={showArchived}
          onToggleArchived={setShowArchived}
          searchBar={
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, artist, or ASC code..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          }
        />
      )}

      {/* Create Dialog */}
      <CreateArtworkDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
