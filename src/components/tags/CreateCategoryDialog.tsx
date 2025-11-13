import { useState } from "react";
import { useCreateCategory } from "@/hooks/useTags";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({ open, onOpenChange }: CreateCategoryDialogProps) {
  const [displayName, setDisplayName] = useState("");
  const [categoryKey, setCategoryKey] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [allowsCustomTags, setAllowsCustomTags] = useState(true);
  const [isHierarchical, setIsHierarchical] = useState(false);
  const createCategory = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createCategory.mutateAsync({
      categoryKey: categoryKey || displayName.toLowerCase().replace(/\s+/g, '_'),
      displayName,
      description,
      scope: ['artwork', 'brand'], // Default scope
      icon,
      color,
      allowsCustomTags,
      isHierarchical,
    });

    // Reset form
    setDisplayName("");
    setCategoryKey("");
    setDescription("");
    setIcon("");
    setColor("");
    setAllowsCustomTags(true);
    setIsHierarchical(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new tag category to organize your taxonomy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Theme"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryKey">Category Key (optional)</Label>
                <Input
                  id="categoryKey"
                  value={categoryKey}
                  onChange={(e) => setCategoryKey(e.target.value)}
                  placeholder="e.g., theme"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this category..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Lucide name)</Label>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g., Palette"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color (hex)</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., #3B82F6"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-md border p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowsCustomTags"
                  checked={allowsCustomTags}
                  onCheckedChange={(checked) => setAllowsCustomTags(checked as boolean)}
                />
                <Label htmlFor="allowsCustomTags" className="cursor-pointer font-normal">
                  Allow custom tags to be created in this category
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isHierarchical"
                  checked={isHierarchical}
                  onCheckedChange={(checked) => setIsHierarchical(checked as boolean)}
                />
                <Label htmlFor="isHierarchical" className="cursor-pointer font-normal">
                  Enable hierarchical tags (parent-child relationships)
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!displayName || createCategory.isPending}>
              {createCategory.isPending ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
