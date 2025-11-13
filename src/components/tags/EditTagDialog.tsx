import { useState, useEffect } from "react";
import { useUpdateTag } from "@/hooks/useTags";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tag } from "@/hooks/useTags";

interface EditTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: Tag | null;
}

export function EditTagDialog({ open, onOpenChange, tag }: EditTagDialogProps) {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const updateTag = useUpdateTag();

  useEffect(() => {
    if (tag) {
      setDisplayName(tag.display_name);
      setDescription(tag.description || "");
    }
  }, [tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tag) return;

    await updateTag.mutateAsync({
      tagId: tag.id,
      displayName,
      description,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update tag details. The tag key cannot be changed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tagKey">Tag Key</Label>
              <Input
                id="tagKey"
                value={tag?.tag_key || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Tag keys cannot be modified after creation.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Usage Count: {tag?.usage_count || 0}</p>
              <p className="text-muted-foreground text-xs mt-1">
                This tag is currently used in {tag?.usage_count || 0} places.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!displayName || updateTag.isPending}>
              {updateTag.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
