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
import { useVariantGroups } from "@/hooks/useVariantGroups";

interface CreateVariantGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateVariantGroupDialog({ open, onOpenChange }: CreateVariantGroupDialogProps) {
  const navigate = useNavigate();
  const { createGroup } = useVariantGroups();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!groupName.trim()) return;

    const result = await createGroup.mutateAsync({
      group_name: groupName,
      description: description || undefined,
    });

    onOpenChange(false);
    setGroupName("");
    setDescription("");

    // Navigate to the new variant group detail page
    if (result?.id) {
      navigate(`/admin/products/groups/${result.id}`);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setGroupName("");
      setDescription("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Variant Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Print Size, Paper Type"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this variant group..."
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
            disabled={!groupName.trim() || createGroup.isPending}
          >
            {createGroup.isPending ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}