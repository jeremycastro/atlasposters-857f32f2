import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskComments } from "./TaskComments";
import { TaskActivityLog } from "./TaskActivityLog";
import { useState, useEffect } from "react";
import { useTaskMutations } from "@/hooks/useTaskMutations";
import { useProfiles } from "@/hooks/useProfiles";
import { useTaskById } from "@/hooks/useTasks";
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
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({});

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Task Details</span>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button size="sm" onClick={handleSave} disabled={updateTask.isPending}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
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
                {editMode ? (
                  <Select
                    value={formData.status || ""}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                ) : (
                  <Badge variant="outline">{task.status}</Badge>
                )}
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
                  <Input
                    value={formData.phase || ""}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  />
                ) : (
                  <p className="text-muted-foreground">{task.phase || "N/A"}</p>
                )}
              </div>

              <div>
                <Label>Milestone</Label>
                {editMode ? (
                  <Input
                    value={formData.milestone || ""}
                    onChange={(e) => setFormData({ ...formData, milestone: e.target.value })}
                  />
                ) : (
                  <p className="text-muted-foreground">{task.milestone || "N/A"}</p>
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
          </TabsContent>

          <TabsContent value="activity">
            <TaskActivityLog taskId={taskId || ""} />
          </TabsContent>

          <TabsContent value="comments">
            <TaskComments taskId={taskId || ""} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
