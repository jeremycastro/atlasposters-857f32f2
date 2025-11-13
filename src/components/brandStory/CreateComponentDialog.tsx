import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrandSelector } from "./BrandSelector";
import { useCreateBrandStoryComponent, useUpdateBrandStoryComponent } from "@/hooks/useBrandStoryMutations";
import { BrandComponentType, COMPONENT_TYPE_LABELS, BrandStoryComponent } from "@/types/brandStory";
import { toast } from "sonner";

interface CreateComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentToEdit?: BrandStoryComponent | null;
}

export const CreateComponentDialog = ({ open, onOpenChange, componentToEdit }: CreateComponentDialogProps) => {
  const [brandId, setBrandId] = useState<string | null>(null);
  const [componentType, setComponentType] = useState<BrandComponentType>("origin_story");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");

  const createComponent = useCreateBrandStoryComponent();
  const updateComponent = useUpdateBrandStoryComponent();
  
  const isEditMode = !!componentToEdit;

  // Populate form when editing
  useEffect(() => {
    if (componentToEdit) {
      setBrandId(componentToEdit.brand_id);
      setComponentType(componentToEdit.component_type);
      setTitle(componentToEdit.title);
      setSubtitle(componentToEdit.subtitle || "");
      setContent(componentToEdit.content);
    } else {
      resetForm();
    }
  }, [componentToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && componentToEdit) {
      await updateComponent.mutateAsync({
        id: componentToEdit.id,
        brand_id: brandId,
        scope: brandId ? "brand" : "atlas_global",
        component_type: componentType,
        title,
        subtitle: subtitle || undefined,
        content,
      });
      toast.success("Component updated successfully");
    } else {
      await createComponent.mutateAsync({
        brand_id: brandId,
        scope: brandId ? "brand" : "atlas_global",
        component_type: componentType,
        title,
        subtitle: subtitle || undefined,
        content,
        status: "draft",
      });
      toast.success("Component created successfully");
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setBrandId(null);
    setComponentType("origin_story");
    setTitle("");
    setSubtitle("");
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Component" : "Create Brand Story Component"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the component details" : "Add a new component to build your brand story and messaging."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <BrandSelector value={brandId} onChange={setBrandId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Component Type</Label>
            <Select value={componentType} onValueChange={(val) => setComponentType(val as BrandComponentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COMPONENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Our Origin Story"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle (optional)</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Additional context"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your brand story content here..."
              rows={8}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createComponent.isPending || updateComponent.isPending}>
              {isEditMode 
                ? (updateComponent.isPending ? "Updating..." : "Update Component")
                : (createComponent.isPending ? "Creating..." : "Create Component")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
