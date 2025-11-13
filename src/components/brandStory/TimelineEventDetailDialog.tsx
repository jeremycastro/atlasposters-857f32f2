import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2, Globe } from "lucide-react";
import { BrandTimelineEvent, EVENT_TYPE_LABELS } from "@/types/brandStory";
import { format } from "date-fns";
import { useUpdateTimelineEvent, useDeleteTimelineEvent } from "@/hooks/useBrandStoryMutations";
import { toast } from "sonner";
import { useState } from "react";

interface TimelineEventDetailDialogProps {
  event: BrandTimelineEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (event: BrandTimelineEvent) => void;
}

export const TimelineEventDetailDialog = ({
  event,
  open,
  onOpenChange,
  onEdit,
}: TimelineEventDetailDialogProps) => {
  const updateEvent = useUpdateTimelineEvent();
  const deleteEvent = useDeleteTimelineEvent();
  const [isEditing, setIsEditing] = useState(false);

  if (!event) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
      setIsEditing(true);
    }
  };

  const handlePublish = () => {
    updateEvent.mutate(
      { id: event.id, is_published: true },
      {
        onSuccess: () => {
          toast.success("Event published successfully");
        },
      }
    );
  };

  const handleUnpublish = () => {
    updateEvent.mutate(
      { id: event.id, is_published: false },
      {
        onSuccess: () => {
          toast.success("Event unpublished successfully");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this timeline event? This action cannot be undone.")) {
      deleteEvent.mutate(event.id, {
        onSuccess: () => {
          toast.success("Event deleted successfully");
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setIsEditing(false);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col mx-4 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader className="flex-shrink-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">
                {EVENT_TYPE_LABELS[event.event_type]}
              </Badge>
              <Badge variant={event.is_published ? "default" : "secondary"}>
                {event.is_published ? "Published" : "Draft"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {format(new Date(event.event_date), "MMM d, yyyy")}
              </Badge>
            </div>
            <DialogTitle className="text-2xl">{event.title}</DialogTitle>
            <DialogDescription className="text-base">
              {event.scope === "brand" ? "Brand-specific event" : "Atlas global event"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <Tabs defaultValue="content" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-6">
              {event.featured_image_url && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={event.featured_image_url} 
                    alt={event.title}
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}
              <div className="prose prose-sm max-w-none">
                <div className="bg-muted/50 p-6 rounded-lg whitespace-pre-wrap">
                  {event.content}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                  <p className="text-sm">{EVENT_TYPE_LABELS[event.event_type]}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Event Date</p>
                  <p className="text-sm">{format(new Date(event.event_date), "PPP")}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={event.is_published ? "default" : "secondary"}>
                    {event.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Scope</p>
                  <Badge variant="secondary">
                    {event.brand_id ? "Brand Specific" : "Global"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{format(new Date(event.created_at), "PPP")}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{format(new Date(event.updated_at), "PPP")}</p>
                </div>
              </div>

              {event.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {event.related_components.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Related Components</p>
                    <p className="text-sm">{event.related_components.length} component(s) linked</p>
                  </div>
                </>
              )}

              {event.related_tasks.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Related Tasks</p>
                    <p className="text-sm">{event.related_tasks.length} task(s) linked</p>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="flex-shrink-0" />

        <div className="flex items-center justify-between gap-2 flex-shrink-0 pt-4">
          {isEditing && (
            <Button
              variant="ghost"
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {!event.is_published ? (
              <Button
                variant="default"
                onClick={handlePublish}
                disabled={updateEvent.isPending}
              >
                <Globe className="h-4 w-4 mr-2" />
                Publish
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleUnpublish}
                disabled={updateEvent.isPending}
              >
                <Globe className="h-4 w-4 mr-2" />
                Unpublish
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
