import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Database } from "@/integrations/supabase/types";

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  created_by_profile?: {
    full_name: string | null;
    email: string;
  } | null;
};

interface ArtworkMetadataTabProps {
  artwork: Artwork;
}

export function ArtworkMetadataTab({ artwork }: ArtworkMetadataTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Artwork ID</Label>
            <p className="text-sm text-muted-foreground font-mono">{artwork.id}</p>
          </div>

          <div className="space-y-2">
            <Label>Sequence Number</Label>
            <p className="text-sm text-muted-foreground">{artwork.sequence_number}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Created At</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(artwork.created_at).toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Updated At</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(artwork.updated_at).toLocaleString()}
            </p>
          </div>
        </div>

        {artwork.created_by_profile && (
          <div className="space-y-2">
            <Label>Created By</Label>
            <p className="text-sm text-muted-foreground">
              {artwork.created_by_profile.full_name || artwork.created_by_profile.email}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
