import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Edit, Archive, Trash2, CheckCircle2 } from "lucide-react";
import { BrandStoryComponent, COMPONENT_TYPE_LABELS } from "@/types/brandStory";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { useUpdateBrandStoryComponent, useDeleteBrandStoryComponent } from "@/hooks/useBrandStoryMutations";
import { toast } from "sonner";
import { useState } from "react";

interface ComponentDetailDialogProps {
  component: BrandStoryComponent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (component: BrandStoryComponent) => void;
}

export const ComponentDetailDialog = ({
  component,
  open,
  onOpenChange,
  onEdit,
}: ComponentDetailDialogProps) => {
  const updateComponent = useUpdateBrandStoryComponent();
  const deleteComponent = useDeleteBrandStoryComponent();

  if (!component) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(component);
    }
  };

  const handleApprove = () => {
    updateComponent.mutate(
      { id: component.id, status: "approved" },
      {
        onSuccess: () => {
          toast.success("Component approved successfully");
        },
      }
    );
  };

  const handleArchive = () => {
    updateComponent.mutate(
      { id: component.id, status: "archived" },
      {
        onSuccess: () => {
          toast.success("Component archived successfully");
          onOpenChange(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this component? This action cannot be undone.")) {
      deleteComponent.mutate(component.id, {
        onSuccess: () => {
          toast.success("Component deleted successfully");
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col mx-4 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader className="flex-shrink-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">
                {COMPONENT_TYPE_LABELS[component.component_type]}
              </Badge>
              <StatusBadge status={component.status} />
              <Badge variant="secondary" className="text-xs">
                v{component.version_number}
              </Badge>
            </div>
            <DialogTitle className="text-2xl">{component.title}</DialogTitle>
            {component.subtitle && (
              <DialogDescription className="text-base">
                {component.subtitle}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col" style={{ minHeight: "400px" }}>
          <Tabs defaultValue="content" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 overflow-y-auto mt-6 data-[state=active]:flex data-[state=active]:flex-col" style={{ minHeight: "350px" }}>
              <div className="prose prose-sm max-w-none">
                <div className="bg-muted/50 p-6 rounded-lg whitespace-pre-wrap">
                  {component.content}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="flex-1 overflow-y-auto mt-6 data-[state=active]:flex data-[state=active]:flex-col" style={{ minHeight: "350px" }}>
              <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Component Type</p>
                  <p className="text-sm">{COMPONENT_TYPE_LABELS[component.component_type]}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div>
                    <StatusBadge status={component.status} />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Version</p>
                  <p className="text-sm">v{component.version_number}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Scope</p>
                  <Badge variant="secondary">
                    {component.brand_id ? "Brand Specific" : "Global"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{format(new Date(component.created_at), "PPP")}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{format(new Date(component.updated_at), "PPP")}</p>
                </div>
              </div>

              {component.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {component.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {component.metadata && Object.keys(component.metadata).length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Metadata</p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(component.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                 </>
               )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-y-auto mt-6 data-[state=active]:flex data-[state=active]:flex-col" style={{ minHeight: "350px" }}>
              <div className="space-y-3">
                {component.parent_version_id ? (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      This is version {component.version_number} of the component.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Parent version ID: {component.parent_version_id}
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      This is the original version of the component.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="flex-shrink-0" />

        <div className="flex items-center justify-between gap-2 flex-shrink-0 pt-4">
          <Button
            variant="ghost"
            onClick={handleDelete}
            disabled={deleteComponent.isPending}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            {component.status === "draft" && (
              <Button
                variant="default"
                onClick={handleApprove}
                disabled={updateComponent.isPending}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}
            {component.status !== "archived" && (
              <Button
                variant="outline"
                onClick={handleArchive}
                disabled={updateComponent.isPending}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
