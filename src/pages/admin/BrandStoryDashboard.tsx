import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Image, Download, Scroll, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandSelector } from "@/components/brandStory/BrandSelector";
import { CreateComponentDialog } from "@/components/brandStory/CreateComponentDialog";
import { CreateTimelineDialog } from "@/components/brandStory/CreateTimelineDialog";
import { ComponentTableView } from "@/components/brandStory/ComponentTableView";
import { ComponentDetailDialog } from "@/components/brandStory/ComponentDetailDialog";
import { TimelineEventTableView } from "@/components/brandStory/TimelineEventTableView";
import { TimelineEventDetailDialog } from "@/components/brandStory/TimelineEventDetailDialog";
import { useBrandStoryStats, useBrandStoryComponents, useBrandTimeline } from "@/hooks/useBrandStory";
import { useDeleteBrandStoryComponent, useDeleteTimelineEvent } from "@/hooks/useBrandStoryMutations";
import { BrandStoryComponent, BrandTimelineEvent, COMPONENT_TYPE_LABELS, STATUS_LABELS } from "@/types/brandStory";
import { toast } from "sonner";

export default function BrandStoryDashboard() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<BrandStoryComponent | null>(null);
  const [componentToEdit, setComponentToEdit] = useState<BrandStoryComponent | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BrandTimelineEvent | null>(null);
  const [eventToEdit, setEventToEdit] = useState<BrandTimelineEvent | null>(null);
  const [eventDetailDialogOpen, setEventDetailDialogOpen] = useState(false);

  const { data: stats } = useBrandStoryStats(selectedBrandId);
  const { data: components = [] } = useBrandStoryComponents(selectedBrandId);
  const { data: events = [] } = useBrandTimeline(selectedBrandId ? [selectedBrandId] : undefined);
  const deleteComponent = useDeleteBrandStoryComponent();
  const deleteEvent = useDeleteTimelineEvent();

  const handleViewComponent = (component: BrandStoryComponent) => {
    setSelectedComponent(component);
    setDetailDialogOpen(true);
  };

  const handleEditComponent = (component: BrandStoryComponent) => {
    setComponentToEdit(component);
    setComponentDialogOpen(true);
  };

  const handleDeleteComponent = (component: BrandStoryComponent) => {
    if (confirm("Are you sure you want to delete this component?")) {
      deleteComponent.mutate(component.id, {
        onSuccess: () => {
          toast.success("Component deleted successfully");
        },
      });
    }
  };

  const handleCreateNewComponent = () => {
    setComponentToEdit(null);
    setComponentDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setComponentDialogOpen(open);
    if (!open) {
      setComponentToEdit(null);
    }
  };

  const handleViewEvent = (event: BrandTimelineEvent) => {
    setSelectedEvent(event);
    setEventDetailDialogOpen(true);
  };

  const handleEditEvent = (event: BrandTimelineEvent) => {
    setEventToEdit(event);
    setTimelineDialogOpen(true);
  };

  const handleDeleteEvent = (event: BrandTimelineEvent) => {
    if (confirm("Are you sure you want to delete this timeline event?")) {
      deleteEvent.mutate(event.id, {
        onSuccess: () => {
          toast.success("Event deleted successfully");
        },
      });
    }
  };

  const handleCreateNewEvent = () => {
    setEventToEdit(null);
    setTimelineDialogOpen(true);
  };

  const handleTimelineDialogClose = (open: boolean) => {
    setTimelineDialogOpen(open);
    if (!open) {
      setEventToEdit(null);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brand Story Management</h1>
        <p className="text-muted-foreground">
          Build and manage your brand narrative, messaging, and content guidelines
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Components</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalComponents || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.componentsByStatus.approved || 0} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTimelineEvents || 0}</div>
            <p className="text-xs text-muted-foreground">Brand evolution documented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssets || 0}</div>
            <p className="text-xs text-muted-foreground">Images & documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exports</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalExports || 0}</div>
            <p className="text-xs text-muted-foreground">Generated materials</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Exhibition */}
      <Card className="bg-gradient-to-r from-amber-950/30 to-stone-900/50 border-amber-500/20">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-500/10">
              <Scroll className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-100">The History of Posters</h3>
              <p className="text-sm text-amber-200/60">An exhibition curated by Atlas — 500+ years of visual communication</p>
            </div>
          </div>
          <Button asChild variant="outline" className="border-amber-500/30 text-amber-200 hover:bg-amber-500/10">
            <Link to="/admin/brand-story/poster-history">
              View Exhibition
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="flex items-center gap-2 pt-6">
          <BrandSelector value={selectedBrandId} onChange={setSelectedBrandId} />
          <Button onClick={handleCreateNewComponent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Component
          </Button>
          <Button variant="outline" onClick={handleCreateNewEvent}>
            <Calendar className="h-4 w-4 mr-2" />
            Add Timeline Event
          </Button>
        </CardContent>
      </Card>

      {/* Components Table */}
      <Card>
        <CardHeader>
          <CardTitle>Components</CardTitle>
          <CardDescription>All brand story components</CardDescription>
        </CardHeader>
        <CardContent>
          <ComponentTableView
            components={components}
            onViewComponent={handleViewComponent}
            onEditComponent={handleEditComponent}
            onDeleteComponent={handleDeleteComponent}
          />
        </CardContent>
      </Card>

      {/* Timeline Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Events</CardTitle>
          <CardDescription>Brand evolution and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <TimelineEventTableView
            events={events}
            onViewEvent={handleViewEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </CardContent>
      </Card>

      <CreateComponentDialog 
        open={componentDialogOpen} 
        onOpenChange={handleDialogClose}
        componentToEdit={componentToEdit}
      />
      <CreateTimelineDialog 
        open={timelineDialogOpen} 
        onOpenChange={handleTimelineDialogClose}
        eventToEdit={eventToEdit}
      />
      <ComponentDetailDialog
        component={selectedComponent}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={handleEditComponent}
      />
      <TimelineEventDetailDialog
        event={selectedEvent}
        open={eventDetailDialogOpen}
        onOpenChange={setEventDetailDialogOpen}
        onEdit={handleEditEvent}
      />
    </div>
  );
}
