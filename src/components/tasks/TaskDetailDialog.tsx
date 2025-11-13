import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Task Details</DialogTitle>
            <Badge variant="secondary" className="font-mono text-xs">
              {task.reference_number}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full flex flex-col flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="details" className="h-full mt-0">
              <div className="p-6 space-y-4">
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
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {task.description || "No description"}
                    </p>
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
                            : formData.status === "testing"
                            ? "Testing"
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
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="mt-2">
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Assigned To</Label>
                    {editMode ? (
                      <Select
                        value={formData.assigned_to || ""}
                        onValueChange={(value) => setFormData({ ...formData, assigned_to: value || null })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
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
                        {task.assigned_to
                          ? profiles?.find((p) => p.id === task.assigned_to)?.full_name ||
                            profiles?.find((p) => p.id === task.assigned_to)?.email ||
                            "Unknown"
                          : "Unassigned"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Phase</Label>
                    {editMode ? (
                      <Select
                        value={formData.phase_id || ""}
                        onValueChange={(value) => {
                          setFormData({ ...formData, phase_id: value || null, milestone_id: null });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent>
                          {phases?.map((phase) => (
                            <SelectItem key={phase.id} value={phase.id}>
                              {phase.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-muted-foreground">
                        {task.phase_id
                          ? phases?.find((p) => p.id === task.phase_id)?.name || "Unknown"
                          : task.phase || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Milestone</Label>
                    {editMode ? (
                      <Select
                        value={formData.milestone_id || ""}
                        onValueChange={(value) => setFormData({ ...formData, milestone_id: value || null })}
                        disabled={!formData.phase_id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={formData.phase_id ? "Select milestone" : "Select phase first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredMilestones.map((milestone) => (
                            <SelectItem key={milestone.id} value={milestone.id}>
                              {milestone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-muted-foreground">
                        {task.milestone_id
                          ? allMilestones?.find((m) => m.id === task.milestone_id)?.name || "Unknown"
                          : task.milestone || "N/A"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Estimated Hours</Label>
                    {editMode ? (
                      <Input
                        type="number"
                        value={formData.estimated_hours || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimated_hours: e.target.value ? parseInt(e.target.value) : null,
                          })
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
              </div>
            </TabsContent>

            <TabsContent value="comments" className="h-full mt-0">
              <div className="p-6">
                <TaskComments taskId={taskId || ""} />
              </div>
            </TabsContent>

            <TabsContent value="activity" className="h-full mt-0">
              <div className="p-6">
                <TaskActivityLog taskId={taskId || ""} />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Sticky Footer with Action Buttons */}
        <div className="shrink-0 bg-background border-t px-6 py-4 flex justify-end gap-2">
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
            <>
              <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button size="sm" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
