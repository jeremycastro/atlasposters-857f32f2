import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrandSelector } from "./BrandSelector";
import { useCreateTimelineEvent, useUpdateTimelineEvent } from "@/hooks/useBrandStoryMutations";
import { BrandEventType, EVENT_TYPE_LABELS, BrandTimelineEvent } from "@/types/brandStory";
import { format } from "date-fns";
import { toast } from "sonner";

interface CreateTimelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit?: BrandTimelineEvent | null;
}

export const CreateTimelineDialog = ({ open, onOpenChange, eventToEdit }: CreateTimelineDialogProps) => {
  const [brandId, setBrandId] = useState<string | null>(null);
  const [eventType, setEventType] = useState<BrandEventType>("milestone");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventDate, setEventDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const createEvent = useCreateTimelineEvent();
  const updateEvent = useUpdateTimelineEvent();
  
  const isEditMode = !!eventToEdit;

  // Populate form when editing
  useEffect(() => {
    if (eventToEdit) {
      setBrandId(eventToEdit.brand_id);
      setEventType(eventToEdit.event_type);
      setTitle(eventToEdit.title);
      setContent(eventToEdit.content);
      setEventDate(format(new Date(eventToEdit.event_date), "yyyy-MM-dd"));
    } else {
      resetForm();
    }
  }, [eventToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && eventToEdit) {
      await updateEvent.mutateAsync({
        id: eventToEdit.id,
        brand_id: brandId,
        scope: brandId ? "brand" : "atlas_global",
        event_type: eventType,
        title,
        content,
        event_date: eventDate,
      });
      toast.success("Event updated successfully");
    } else {
      await createEvent.mutateAsync({
        brand_id: brandId,
        scope: brandId ? "brand" : "atlas_global",
        event_type: eventType,
        title,
        content,
        event_date: eventDate,
        is_published: false,
      });
      toast.success("Event created successfully");
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setBrandId(null);
    setEventType("milestone");
    setTitle("");
    setContent("");
    setEventDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Timeline Event" : "Create Timeline Event"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the event details" : "Document an important moment in your brand's evolution."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <BrandSelector value={brandId} onChange={setBrandId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select value={eventType} onValueChange={(val) => setEventType(val as BrandEventType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Event Date</Label>
            <Input
              id="date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Decided on Brand Archetype"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe what happened and why it matters..."
              rows={8}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending}>
              {isEditMode 
                ? (updateEvent.isPending ? "Updating..." : "Update Event")
                : (createEvent.isPending ? "Creating..." : "Create Event")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
