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
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="asc-code" className="text-right">ASC Code</Label>
            <Badge variant="outline" className="font-mono text-base px-3 py-1 w-fit">
              {artwork.asc_code}
            </Badge>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            {isEditing ? (
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant={
                formData.status === 'active' ? 'default' :
                formData.status === 'draft' ? 'secondary' : 'outline'
              } className="w-fit">
                {formData.status}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            {isEditing ? (
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            ) : (
              <p className="text-sm">{formData.title || "—"}</p>
            )}
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="artist" className="text-right">Artist Name</Label>
            {isEditing ? (
              <Input
                id="artist"
                value={formData.artist_name}
                onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
              />
            ) : (
              <p className="text-sm">{formData.artist_name || "—"}</p>
            )}
          </div>

          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{formData.description || "—"}</p>
            )}
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="art-medium" className="text-right">Art Medium</Label>
            {isEditing ? (
              <Input
                id="art-medium"
                value={formData.art_medium}
                onChange={(e) => setFormData({ ...formData, art_medium: e.target.value })}
                placeholder="e.g., Oil on Canvas"
              />
            ) : (
              <p className="text-sm">{formData.art_medium || "—"}</p>
            )}
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="original-dimensions" className="text-right">Original Dimensions</Label>
            {isEditing ? (
              <Input
                id="original-dimensions"
                value={formData.original_dimensions}
                onChange={(e) => setFormData({ ...formData, original_dimensions: e.target.value })}
                placeholder="e.g., 24 x 36 inches"
              />
            ) : (
              <p className="text-sm">{formData.original_dimensions || "—"}</p>
            )}
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="year-created" className="text-right">Year Created</Label>
            {isEditing ? (
              <Input
                id="year-created"
                type="number"
                value={formData.year_created || ""}
                onChange={(e) => setFormData({ ...formData, year_created: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="e.g., 2023"
                className="w-[200px]"
              />
            ) : (
              <p className="text-sm">{formData.year_created || "—"}</p>
            )}
          </div>

          {artwork.brand && (
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <Label className="text-right">Brand</Label>
              <p className="text-sm">{artwork.brand.brand_name}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
