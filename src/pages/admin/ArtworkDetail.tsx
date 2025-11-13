import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { PartnerBreadcrumb } from "@/components/admin/PartnerBreadcrumb";
import { ArtworkInfoTab } from "@/components/artworks/tabs/ArtworkInfoTab";
import { ArtworkFilesTab } from "@/components/artworks/tabs/ArtworkFilesTab";
import { ArtworkRightsTab } from "@/components/artworks/tabs/ArtworkRightsTab";
import { ArtworkTagsTab } from "@/components/artworks/tabs/ArtworkTagsTab";
import { ArtworkMetadataTab } from "@/components/artworks/tabs/ArtworkMetadataTab";

export default function ArtworkDetail() {
  const { artworkId } = useParams<{ artworkId: string }>();
  const navigate = useNavigate();

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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{artwork.title || "Untitled Artwork"}</h1>
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

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="rights">Rights & Licensing</TabsTrigger>
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
    </div>
  );
}
