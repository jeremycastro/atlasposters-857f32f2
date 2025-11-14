import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useArtworkMutations } from "@/hooks/useArtworkMutations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Archive } from "lucide-react";
import { PartnerBreadcrumb } from "@/components/admin/PartnerBreadcrumb";
import { ArtworkInfoTab } from "@/components/artworks/tabs/ArtworkInfoTab";
import { ArtworkFilesTab } from "@/components/artworks/tabs/ArtworkFilesTab";
import { ArtworkProductsTab } from "@/components/artworks/tabs/ArtworkProductsTab";
import { ArtworkRightsTab } from "@/components/artworks/tabs/ArtworkRightsTab";
import { ArtworkTagsTab } from "@/components/artworks/tabs/ArtworkTagsTab";
import { ArtworkMetadataTab } from "@/components/artworks/tabs/ArtworkMetadataTab";
import { useState } from "react";

export default function ArtworkDetail() {
  const { artworkId } = useParams<{ artworkId: string }>();
  const navigate = useNavigate();
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const { archiveArtwork } = useArtworkMutations();

  const { data: artwork, isLoading } = useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          brand:brands(
            id,
            brand_name,
            partner:partners(
              id,
              partner_name
            )
          ),
          created_by_profile:profiles!artworks_created_by_fkey(
            full_name,
            email
          )
        `)
        .eq('id', artworkId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!artworkId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Artwork not found</h2>
          <p className="text-muted-foreground mt-2">
            The artwork you're looking for doesn't exist or has been removed.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/admin/artworks')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Artworks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button & Breadcrumb */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/artworks')}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Artworks
        </Button>

        <PartnerBreadcrumb
          segments={[
            { label: "Artwork Catalog", href: "/admin/artworks" },
            { label: artwork.title || "Untitled", href: `/admin/artworks/${artwork.id}` }
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{artwork.title || "Untitled Artwork"}</h1>
            <Badge variant={artwork.status === 'active' ? 'default' : artwork.status === 'draft' ? 'secondary' : 'outline'}>
              {artwork.status}
            </Badge>
          </div>
          {artwork.artist_name && (
            <p className="text-lg text-muted-foreground">by {artwork.artist_name}</p>
          )}
          {artwork.brand && (
            <p className="text-sm text-muted-foreground">
              Brand: {artwork.brand.brand_name}
              {artwork.brand.partner && ` • Partner: ${artwork.brand.partner.partner_name}`}
            </p>
          )}
        </div>
        {artwork.status !== 'archived' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setArchiveDialogOpen(true)}
            className="shrink-0"
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="rights">Rights</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="info">
            <ArtworkInfoTab artwork={artwork} />
          </TabsContent>

          <TabsContent value="files">
            <ArtworkFilesTab artworkId={artwork.id} />
          </TabsContent>

          <TabsContent value="products">
            <ArtworkProductsTab artworkId={artwork.id} ascCode={artwork.asc_code} />
          </TabsContent>

          <TabsContent value="rights">
            <ArtworkRightsTab artwork={artwork} />
          </TabsContent>

          <TabsContent value="tags">
            <ArtworkTagsTab artworkId={artwork.id} />
          </TabsContent>

          <TabsContent value="metadata">
            <ArtworkMetadataTab artwork={artwork} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Artwork?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive "{artwork.title || 'Untitled Artwork'}". The artwork will be hidden from active listings but can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                archiveArtwork.mutate(artwork.id, {
                  onSuccess: () => {
                    setArchiveDialogOpen(false);
                    navigate('/admin/artworks');
                  }
                });
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
