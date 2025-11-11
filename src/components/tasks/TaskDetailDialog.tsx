import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskComments } from "./TaskComments";
import { TaskActivityLog } from "./TaskActivityLog";
import { useState, useEffect } from "react";
import { useTaskMutations } from "@/hooks/useTaskMutations";
import { useProfiles } from "@/hooks/useProfiles";
import { useTaskById } from "@/hooks/useTasks";
import { useRoadmapVersions, useRoadmapWithProgress } from "@/hooks/useRoadmap";
import type { Database } from "@/integrations/supabase/types";

type Task = Database["public"]["Tables"]["project_tasks"]["Row"];

interface TaskDetailDialogProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskDetailDialog = ({ taskId, open, onOpenChange }: TaskDetailDialogProps) => {
  const { data: task, isLoading } = useTaskById(taskId || undefined);
  const { updateTask } = useTaskMutations();
  const { data: profiles } = useProfiles();
  const { data: versions } = useRoadmapVersions();
  const activeVersion = versions?.[0]?.id;
  const { data: phasesData } = useRoadmapWithProgress(activeVersion);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({});

  // Prepare phases and milestones data
  const phases = phasesData || [];
  const allMilestones = phases.flatMap(p => 
    p.milestones?.map(m => ({ ...m, phase_id: p.id, phase_name: p.name })) || []
  );
  const filteredMilestones = formData.phase_id 
    ? allMilestones.filter(m => m.phase_id === formData.phase_id)
    : allMilestones;

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleSave = () => {
    if (!taskId || !task) return;
    
    updateTask.mutate(
      {
        id: taskId,
        updates: formData,
        oldData: task,
      },
      {
        onSuccess: () => {
          setEditMode(false);
        },
      }
    );
  };

  if (isLoading) {
    return null;
  }

  if (!task) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        {/* Sticky Navigation */}
        <nav className="sticky top-0 z-10 bg-background border-b -mx-6 px-6 py-3">
          <div className="flex gap-6">
            <a 
              href="#details" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Details
            </a>
            <a 
              href="#activity" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Activity
            </a>
            <a 
              href="#comments" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Comments
            </a>
          </div>
        </nav>

        {/* Scrollable Content */}
        <div className="overflow-y-auto -mx-6 px-6 space-y-8 scroll-smooth">
          {/* Details Section */}
          <section id="details" className="space-y-4 pt-4">
            <div>
              <Label>Title</Label>
              {editMode ? (
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              ) : (
                <p className="text-foreground font-medium">{task.title}</p>
              )}
            </div>

            <div>
              <Label>Description</Label>
              {editMode ? (
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{task.description || "No description"}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value: any) => {
                    const newFormData = { ...formData, status: value };
                    setFormData(newFormData);
                    if (!editMode && taskId && task) {
                      updateTask.mutate({
                        id: taskId,
                        updates: { status: value },
                        oldData: task,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="h-auto p-0 border-0 shadow-none hover:bg-transparent">
                    <Badge 
                      variant={formData.status as any || "outline"} 
                      className="text-sm px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {formData.status === "in_progress" 
                        ? "In Progress" 
                        : formData.status === "in_review" 
                        ? "In Review" 
                        : formData.status === "todo"
                        ? "To Do"
                        : formData.status 
                        ? formData.status.charAt(0).toUpperCase() + formData.status.slice(1) 
                        : "Select"}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                {editMode ? (
                  <Select
                    value={formData.priority || ""}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">{task.priority}</Badge>
                )}
              </div>
            </div>

            <div>
              <Label>Assigned To</Label>
              {editMode ? (
                <Select
                  value={formData.assigned_to || ""}
                  onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles?.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name || profile.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground">
                  {(task as any).assigned_to_profile?.full_name || "Unassigned"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Phase</Label>
                {editMode ? (
                  <Select
                    value={formData.phase_id || undefined}
                    onValueChange={(value) => {
                      setFormData({ 
                        ...formData, 
                        phase_id: value || null,
                        milestone_id: null
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map((phase) => (
                        <SelectItem key={phase.id} value={phase.id}>
                          Phase {phase.phase_number}: {phase.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground">
                    {(task as any).phase_data 
                      ? `Phase ${(task as any).phase_data.phase_number}: ${(task as any).phase_data.name}`
                      : "N/A"}
                  </p>
                )}
              </div>

              <div>
                <Label>Milestone</Label>
                {editMode ? (
                  <Select
                    value={formData.milestone_id || undefined}
                    onValueChange={(value) => setFormData({ ...formData, milestone_id: value || null })}
                    disabled={!formData.phase_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.phase_id ? "Select milestone" : "Select phase first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredMilestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          {milestone.milestone_number}: {milestone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground">
                    {(task as any).milestone_data 
                      ? `${(task as any).milestone_data.milestone_number}: ${(task as any).milestone_data.name}`
                      : "N/A"}
                  </p>
                )}
              </div>

              <div>
                <Label>Est. Hours</Label>
                {editMode ? (
                  <Input
                    type="number"
                    value={formData.estimated_hours || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || null })
                    }
                  />
                ) : (
                  <p className="text-muted-foreground">{task.estimated_hours || "N/A"}</p>
                )}
              </div>
            </div>

            {task.tags && task.tags.length > 0 && (
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>

          <Separator />

          {/* Activity Section */}
          <section id="activity" className="space-y-4">
            <h3 className="text-lg font-semibold">Activity Log</h3>
            <TaskActivityLog taskId={taskId || ""} />
          </section>

          <Separator />

          {/* Comments Section */}
          <section id="comments" className="space-y-4 pb-4">
            <h3 className="text-lg font-semibold">Comments</h3>
            <TaskComments taskId={taskId || ""} />
          </section>
        </div>

        {/* Sticky Footer with Action Buttons */}
        <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4 flex justify-end gap-2">
          {editMode ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updateTask.isPending}>
                Save
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
