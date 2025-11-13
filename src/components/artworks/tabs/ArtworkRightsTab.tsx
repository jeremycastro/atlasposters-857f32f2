import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit2, Save, X } from "lucide-react";
import { useArtworkMutations } from "@/hooks/useArtworkMutations";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Artwork = Database['public']['Tables']['artworks']['Row'];

interface ArtworkRightsTabProps {
  artwork: Artwork;
}

export function ArtworkRightsTab({ artwork }: ArtworkRightsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    rights_start_date: artwork.rights_start_date || "",
    rights_end_date: artwork.rights_end_date || "",
    is_exclusive: artwork.is_exclusive || false,
  });

  const { updateArtwork } = useArtworkMutations();

  const handleSave = async () => {
    try {
      await updateArtwork.mutateAsync({
        id: artwork.id,
        updates: formData,
      });
      setIsEditing(false);
      toast.success("Rights information updated successfully");
    } catch (error) {
      toast.error("Failed to update rights information");
    }
  };

  const handleCancel = () => {
    setFormData({
      rights_start_date: artwork.rights_start_date || "",
      rights_end_date: artwork.rights_end_date || "",
      is_exclusive: artwork.is_exclusive || false,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Rights & Licensing</CardTitle>
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
            <Label htmlFor="rights-start">Rights Start Date</Label>
            {isEditing ? (
              <Input
                id="rights-start"
                type="date"
                value={formData.rights_start_date}
                onChange={(e) => setFormData({ ...formData, rights_start_date: e.target.value })}
              />
            ) : (
              <p className="text-sm py-2">
                {formData.rights_start_date ? new Date(formData.rights_start_date).toLocaleDateString() : "—"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rights-end">Rights End Date</Label>
            {isEditing ? (
              <Input
                id="rights-end"
                type="date"
                value={formData.rights_end_date}
                onChange={(e) => setFormData({ ...formData, rights_end_date: e.target.value })}
              />
            ) : (
              <p className="text-sm py-2">
                {formData.rights_end_date ? new Date(formData.rights_end_date).toLocaleDateString() : "—"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-exclusive"
            checked={formData.is_exclusive}
            onCheckedChange={(checked) => setFormData({ ...formData, is_exclusive: checked })}
            disabled={!isEditing}
          />
          <Label htmlFor="is-exclusive" className="cursor-pointer">
            Exclusive Rights
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
