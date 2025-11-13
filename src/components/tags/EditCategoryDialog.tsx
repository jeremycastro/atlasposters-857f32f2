import { useState, useEffect } from "react";
import { useUpdateCategory } from "@/hooks/useTags";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Category } from "@/hooks/useTags";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function EditCategoryDialog({ open, onOpenChange, category }: EditCategoryDialogProps) {
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [allowsCustomTags, setAllowsCustomTags] = useState(true);
  const [isHierarchical, setIsHierarchical] = useState(false);
  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setDisplayName(category.display_name);
      setDescription(category.description || "");
      setIcon(category.icon || "");
      setColor(category.color || "");
      setAllowsCustomTags(category.allows_custom_tags);
      setIsHierarchical(category.is_hierarchical);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) return;

    await updateCategory.mutateAsync({
      categoryId: category.id,
      displayName,
      description,
      icon,
      color,
      allowsCustomTags,
      isHierarchical,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details. The category key cannot be changed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryKey">Category Key</Label>
              <Input
                id="categoryKey"
                value={category?.category_key || ""}
                disabled
                className="bg-muted"
              />
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
            <Button type="submit" disabled={!displayName || updateCategory.isPending}>
              {updateCategory.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
