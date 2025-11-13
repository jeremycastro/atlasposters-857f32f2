import { useState, useEffect } from "react";
import { useCurrentRoadmapVersion, useRoadmapWithProgress, useRoadmapMutations } from "@/hooks/useRoadmap";
import { useTasks } from "@/hooks/useTasks";
import { useTaskMutations } from "@/hooks/useTaskMutations";
import { useProfiles } from "@/hooks/useProfiles";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { TaskDetailDialog } from "@/components/tasks/TaskDetailDialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Row Component
const SortableTaskRow = ({ task, getStatusBadge, handleTaskClick, updateTask, profiles }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleStatusChange = (newStatus: string) => {
    updateTask.mutate({
      id: task.id,
      updates: { status: newStatus },
      oldData: task,
    });
  };

  const handlePriorityChange = (newPriority: string) => {
    updateTask.mutate({
      id: task.id,
      updates: { priority: newPriority },
      oldData: task,
    });
  };

  const handleAssigneeChange = (newAssignee: string) => {
    updateTask.mutate({
      id: task.id,
      updates: { assigned_to: newAssignee === "unassigned" ? null : newAssignee },
      oldData: task,
    });
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="hover:bg-muted/50"
    >
      <TableCell>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Select value={task.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backlog">Backlog</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {task.reference_number}
      </TableCell>
      <TableCell 
        className="font-medium cursor-pointer"
        onClick={() => handleTaskClick(task.id)}
      >
        {task.title}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Select value={task.priority} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-28 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Select 
          value={task.assigned_to || "unassigned"} 
          onValueChange={handleAssigneeChange}
        >
          <SelectTrigger className="w-40 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {profiles?.map((profile: any) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.full_name || profile.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell 
        className="text-right cursor-pointer"
        onClick={() => handleTaskClick(task.id)}
      >
        {task.estimated_hours || "-"}
      </TableCell>
    </TableRow>
  );
};

const RoadmapManager = () => {
  const { data: currentVersion, isLoading: versionLoading } = useCurrentRoadmapVersion();
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { toggleDeliverable } = useRoadmapMutations();
  const { reorderTasks, updateTask } = useTaskMutations();
  const { data: profiles } = useProfiles();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const { data: phasesWithProgress, isLoading: progressLoading } = useRoadmapWithProgress(
    currentVersion?.id
  );

  // Initialize all phases as expanded by default
  useEffect(() => {
    if (phasesWithProgress && expandedPhases.size === 0) {
      setExpandedPhases(new Set(phasesWithProgress.map((phase: any) => phase.id)));
    }
  }, [phasesWithProgress]);

  // Fetch all tasks to show in milestone tables
  const { data: allTasks } = useTasks();

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestones((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneId)) {
        newSet.delete(milestoneId);
      } else {
        newSet.add(milestoneId);
      }
      return newSet;
    });
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDetailDialogOpen(true);
  };

  const handleToggleDeliverable = (milestoneId: string, deliverableIndex: number) => {
    toggleDeliverable.mutate({ milestoneId, deliverableIndex });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleDragEnd = (event: DragEndEvent, milestoneId: string) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const milestoneTasks = allTasks?.filter((task) => task.milestone_id === milestoneId) || [];
    const oldIndex = milestoneTasks.findIndex((task) => task.id === active.id);
    const newIndex = milestoneTasks.findIndex((task) => task.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedTasks = arrayMove(milestoneTasks, oldIndex, newIndex);

    // Update order_index for all affected tasks
    const tasksToUpdate = reorderedTasks.map((task, index) => ({
      id: task.id,
      order_index: index + 1,
    }));

    reorderTasks.mutate({ tasks: tasksToUpdate });
  };

  const getStatusBadge = (status: string) => {
    const variantMap: Record<string, any> = {
      completed: "completed",
      in_progress: "in_progress",
      blocked: "blocked",
      testing: "testing",
      in_review: "in_review",
      not_started: "backlog",
      backlog: "backlog",
      planned: "backlog",
      on_hold: "blocked",
    };
    
    return (
      <Badge variant={variantMap[status] || "backlog"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Roadmap Management</h1>
          <p className="text-muted-foreground">
            Manage versions, phases, and milestones with live progress tracking
          </p>
          {versionLoading ? (
            <Skeleton className="h-6 w-96 mt-4" />
          ) : currentVersion ? (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="text-base px-3 py-1">
                v{currentVersion.version}
              </Badge>
              <span className="text-lg font-medium">{currentVersion.title}</span>
            </div>
          ) : null}
        </div>

        {progressLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {phasesWithProgress?.map((phase: any) => {
              const isPhaseExpanded = expandedPhases.has(phase.id);
              
              return (
                <Card key={phase.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="flex items-start gap-3 flex-1 text-left hover:opacity-70 transition-opacity"
                      >
                        {isPhaseExpanded ? (
                          <ChevronDown className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                        )}
                        <div>
                          <CardTitle className="text-2xl">
                            Phase {phase.phase_number}: {phase.name}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {phase.description}
                          </CardDescription>
                        </div>
                      </button>
                      {getStatusBadge(phase.status)}
                    </div>
                  </CardHeader>
                  {isPhaseExpanded && (
                    <CardContent>
                  <div className="space-y-6">
                    {phase.milestones?.map((milestone: any) => {
                      const milestoneTasks = allTasks?.filter(task => task.milestone_id === milestone.id) || [];
                      const isExpanded = expandedMilestones.has(milestone.id);
                      
                      return (
                        <div
                          key={milestone.id}
                          className="border rounded-lg p-4 space-y-3 min-h-[120px]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <button
                                onClick={() => toggleMilestone(milestone.id)}
                                className="flex items-center gap-2 mb-1 hover:opacity-70 transition-opacity w-full text-left"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                {getStatusIcon(milestone.status)}
                                <h4 className="font-semibold">
                                  {milestone.milestone_number}: {milestone.name}
                                </h4>
                              </button>
                              <p className="text-sm text-muted-foreground ml-10">
                                {milestone.description}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                milestone.status === "completed" ? "completed" :
                                milestone.status === "in_progress" ? "in_progress" :
                                milestone.status === "blocked" ? "blocked" :
                                "backlog"
                              }
                              className="px-4 py-2 text-sm font-semibold"
                            >
                              {milestone.status.replace("_", " ")}
                              {milestone.progress && milestone.progress.total > 0 && 
                                ` • ${milestone.progress.completed}/${milestone.progress.total}`
                              }
                            </Badge>
                          </div>

                          {/* Summary when collapsed */}
                          {!isExpanded && milestone.deliverables && milestone.deliverables.length > 0 && (
                            <div className="text-xs text-muted-foreground ml-10">
                              {milestone.deliverables.filter((d: any) => d.completed).length}/{milestone.deliverables.length} deliverables completed
                            </div>
                          )}

                          {/* Deliverables with checkboxes - Only visible when expanded */}
                          {isExpanded && milestone.deliverables && milestone.deliverables.length > 0 && (
                            <div className="space-y-2 py-2 border-t pt-4">
                              <h5 className="text-sm font-semibold">Deliverables:</h5>
                              <div className="space-y-2">
                                {milestone.deliverables.map((deliverable: any, idx: number) => {
                                  const isCompleted = deliverable.completed || false;
                                  
                                  return (
                                    <div key={idx} className="flex items-center gap-2">
                                      <Checkbox
                                        id={`deliverable-${milestone.id}-${idx}`}
                                        checked={isCompleted}
                                        onCheckedChange={() => handleToggleDeliverable(milestone.id, idx)}
                                      />
                                      <label
                                        htmlFor={`deliverable-${milestone.id}-${idx}`}
                                        className={`text-sm cursor-pointer flex-1 ${
                                          isCompleted ? "line-through text-muted-foreground" : ""
                                        }`}
                                      >
                                        {deliverable.text || deliverable}
                                      </label>
                                    </div>
                                  );
                                })}
                                <div className="text-xs text-muted-foreground pt-1">
                                  {milestone.deliverables.filter((d: any) => d.completed).length}/{milestone.deliverables.length} deliverables completed
                                </div>
                              </div>
                            </div>
                          )}

                        {milestone.progress?.total === 0 && !isExpanded && (
                          <p className="text-sm text-muted-foreground">
                            No tasks assigned to this milestone yet
                          </p>
                        )}

                        {/* Tasks Table - Only visible when expanded */}
                        {isExpanded && (
                          <div className="mt-4 border-t pt-4">
                            {milestoneTasks.length > 0 ? (
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleDragEnd(event, milestone.id)}
                              >
                                <Table>
                                   <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-12"></TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Task#</TableHead>
                                      <TableHead>Task</TableHead>
                                      <TableHead>Priority</TableHead>
                                      <TableHead>Assigned To</TableHead>
                                      <TableHead className="text-right">Est. Hours</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <SortableContext
                                    items={milestoneTasks.map((task) => task.id)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    <TableBody>
                                      {milestoneTasks.map((task) => (
                                    <SortableTaskRow
                                      key={task.id}
                                      task={task}
                                      getStatusBadge={getStatusBadge}
                                      handleTaskClick={handleTaskClick}
                                      updateTask={updateTask}
                                      profiles={profiles}
                                    />
                                      ))}
                                    </TableBody>
                                  </SortableContext>
                                </Table>
                              </DndContext>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No tasks assigned to this milestone yet
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )})}
                  </div>
                </CardContent>
                  )}
              </Card>
              );
            })}
          </div>
        )}

        {/* Task Detail Dialog */}
        <TaskDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          taskId={selectedTaskId}
        />
      </main>
    </div>
  );
};

export default RoadmapManager;
