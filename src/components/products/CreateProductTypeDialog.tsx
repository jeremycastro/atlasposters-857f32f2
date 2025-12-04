import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProductTypeMutations } from "@/hooks/useProductTypeMutations";

interface CreateProductTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductTypeDialog({ open, onOpenChange }: CreateProductTypeDialogProps) {
  const navigate = useNavigate();
  const { createProductType } = useProductTypeMutations();

  const [typeCode, setTypeCode] = useState("");
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!typeCode.trim() || typeCode.length !== 3 || !typeName.trim()) return;

    const result = await createProductType.mutateAsync({
      type_code: typeCode.toUpperCase(),
      type_name: typeName,
      description: description || undefined,
    });

    onOpenChange(false);
    setTypeCode("");
    setTypeName("");
    setDescription("");

    // Navigate to the new product type detail page
    if (result?.id) {
      navigate(`/admin/products/types/${result.id}`);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setTypeCode("");
      setTypeName("");
      setDescription("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="typeCode">Type Code (3 letters)</Label>
              <Input
                id="typeCode"
                value={typeCode}
                onChange={(e) => setTypeCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))}
                placeholder="PST"
                className="font-mono uppercase"
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeName">Type Name</Label>
              <Input
                id="typeName"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="e.g., Poster"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this product type..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!typeCode.trim() || typeCode.length !== 3 || !typeName.trim() || createProductType.isPending}
          >
            {createProductType.isPending ? "Creating..." : "Create Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}