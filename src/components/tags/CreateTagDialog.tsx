import { useState } from "react";
import { useCreateTag } from "@/hooks/useTags";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryKey: string;
  categoryName: string;
}

export function CreateTagDialog({ open, onOpenChange, categoryKey, categoryName }: CreateTagDialogProps) {
  const [displayName, setDisplayName] = useState("");
  const [tagKey, setTagKey] = useState("");
  const [description, setDescription] = useState("");
  const createTag = useCreateTag();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createTag.mutateAsync({
      categoryKey,
      tagKey: tagKey || displayName.toLowerCase().replace(/\s+/g, '_'),
      displayName,
      description,
    });

    setDisplayName("");
    setTagKey("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Tag to {categoryName}</DialogTitle>
            <DialogDescription>
              Create a new tag in this category. The tag key will be auto-generated if not provided.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Abstract Art"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagKey">Tag Key (optional)</Label>
              <Input
                id="tagKey"
                value={tagKey}
                onChange={(e) => setTagKey(e.target.value)}
                placeholder="e.g., abstract_art (auto-generated if empty)"
              />
              <p className="text-xs text-muted-foreground">
                Used internally. Leave empty to auto-generate from display name.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!displayName || createTag.isPending}>
              {createTag.isPending ? "Creating..." : "Create Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
