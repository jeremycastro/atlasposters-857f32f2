import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Image, Download } from "lucide-react";
import { BrandSelector } from "@/components/brandStory/BrandSelector";
import { CreateComponentDialog } from "@/components/brandStory/CreateComponentDialog";
import { CreateTimelineDialog } from "@/components/brandStory/CreateTimelineDialog";
import { ComponentTableView } from "@/components/brandStory/ComponentTableView";
import { ComponentDetailDialog } from "@/components/brandStory/ComponentDetailDialog";
import { TimelineEventCard } from "@/components/brandStory/TimelineEventCard";
import { useBrandStoryStats, useBrandStoryComponents, useBrandTimeline } from "@/hooks/useBrandStory";
import { useDeleteBrandStoryComponent } from "@/hooks/useBrandStoryMutations";
import { BrandStoryComponent, COMPONENT_TYPE_LABELS, STATUS_LABELS } from "@/types/brandStory";
import { toast } from "sonner";

export default function BrandStoryDashboard() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<BrandStoryComponent | null>(null);
  const [componentToEdit, setComponentToEdit] = useState<BrandStoryComponent | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: stats } = useBrandStoryStats(selectedBrandId);
  const { data: components = [] } = useBrandStoryComponents(selectedBrandId);
  const { data: recentTimeline = [] } = useBrandTimeline(selectedBrandId ? [selectedBrandId] : undefined);
  const deleteComponent = useDeleteBrandStoryComponent();

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

  return (
    <div className="space-y-6">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started building your brand story</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <BrandSelector value={selectedBrandId} onChange={setSelectedBrandId} />
          <Button onClick={handleCreateNewComponent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Component
          </Button>
          <Button variant="outline" onClick={() => setTimelineDialogOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Add Timeline Event
          </Button>
        </CardContent>
      </Card>

      {/* Component Distribution */}
      {stats && stats.totalComponents > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Component Distribution</CardTitle>
            <CardDescription>Components by type and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">By Type</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(stats.componentsByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {COMPONENT_TYPE_LABELS[type as keyof typeof COMPONENT_TYPE_LABELS]}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">By Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(stats.componentsByStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Recent Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Timeline Events</CardTitle>
          <CardDescription>Latest brand evolution moments</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTimeline.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No timeline events yet. Document your brand's journey!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recentTimeline.slice(0, 4).map((event) => (
                <TimelineEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateComponentDialog 
        open={componentDialogOpen} 
        onOpenChange={handleDialogClose}
        componentToEdit={componentToEdit}
      />
      <CreateTimelineDialog 
        open={timelineDialogOpen} 
        onOpenChange={setTimelineDialogOpen} 
      />
      <ComponentDetailDialog
        component={selectedComponent}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={handleEditComponent}
      />
    </div>
  );
}
