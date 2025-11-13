import { useDeleteTag } from "@/hooks/useTags";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Tag } from "@/hooks/useTags";

interface DeleteTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: Tag | null;
}

export function DeleteTagDialog({ open, onOpenChange, tag }: DeleteTagDialogProps) {
  const deleteTag = useDeleteTag();

  const handleDelete = async () => {
    if (!tag) return;

    await deleteTag.mutateAsync(tag.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the tag "{tag?.display_name}"?
            {tag && tag.usage_count > 0 && (
              <span className="block mt-2 font-medium text-destructive">
                This tag is currently used in {tag.usage_count} places and will be removed from all entities.
              </span>
            )}
            <span className="block mt-2">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTag.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteTag.isPending ? "Deleting..." : "Delete Tag"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
