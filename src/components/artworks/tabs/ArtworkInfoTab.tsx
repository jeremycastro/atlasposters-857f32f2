import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X } from "lucide-react";
import { useArtworkMutations } from "@/hooks/useArtworkMutations";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  brand?: {
    id: string;
    brand_name: string;
  } | null;
};

interface ArtworkInfoTabProps {
  artwork: Artwork;
}

export function ArtworkInfoTab({ artwork }: ArtworkInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: artwork.title || "",
    artist_name: artwork.artist_name || "",
    description: artwork.description || "",
    status: artwork.status || "draft",
    art_medium: artwork.art_medium || "",
    original_dimensions: artwork.original_dimensions || "",
    year_created: artwork.year_created || undefined,
  });

  const { updateArtwork } = useArtworkMutations();

  const handleSave = async () => {
    try {
      await updateArtwork.mutateAsync({
        id: artwork.id,
        updates: formData,
      });
      setIsEditing(false);
      toast.success("Artwork updated successfully");
    } catch (error) {
      toast.error("Failed to update artwork");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: artwork.title || "",
      artist_name: artwork.artist_name || "",
      description: artwork.description || "",
      status: artwork.status || "draft",
      art_medium: artwork.art_medium || "",
      original_dimensions: artwork.original_dimensions || "",
      year_created: artwork.year_created || undefined,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Basic Information</CardTitle>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updateArtwork.isPending}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="asc-code">ASC Code</Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-base px-3 py-1">
                {artwork.asc_code}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="h-10 flex items-center">
                <Badge variant={
                  formData.status === 'active' ? 'default' :
                  formData.status === 'draft' ? 'secondary' : 'outline'
                }>
                  {formData.status}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          {isEditing ? (
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          ) : (
            <p className="text-sm py-2">{formData.title || "—"}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="artist">Artist Name</Label>
          {isEditing ? (
            <Input
              id="artist"
              value={formData.artist_name}
              onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
            />
          ) : (
            <p className="text-sm py-2">{formData.artist_name || "—"}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          {isEditing ? (
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          ) : (
            <p className="text-sm py-2 whitespace-pre-wrap">{formData.description || "—"}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="art-medium">Art Medium</Label>
            {isEditing ? (
              <Input
                id="art-medium"
                value={formData.art_medium}
                onChange={(e) => setFormData({ ...formData, art_medium: e.target.value })}
                placeholder="e.g., Oil on Canvas"
              />
            ) : (
              <p className="text-sm py-2">{formData.art_medium || "—"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="original-dimensions">Original Dimensions</Label>
            {isEditing ? (
              <Input
                id="original-dimensions"
                value={formData.original_dimensions}
                onChange={(e) => setFormData({ ...formData, original_dimensions: e.target.value })}
                placeholder="e.g., 24 x 36 inches"
              />
            ) : (
              <p className="text-sm py-2">{formData.original_dimensions || "—"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-created">Year Created</Label>
            {isEditing ? (
              <Input
                id="year-created"
                type="number"
                value={formData.year_created || ""}
                onChange={(e) => setFormData({ ...formData, year_created: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="e.g., 2023"
              />
            ) : (
              <p className="text-sm py-2">{formData.year_created || "—"}</p>
            )}
          </div>
        </div>

        {artwork.brand && (
          <div className="space-y-2">
            <Label>Brand</Label>
            <p className="text-sm py-2">{artwork.brand.brand_name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
