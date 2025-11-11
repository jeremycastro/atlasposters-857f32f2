import { useState } from "react";
import { useRoadmapVersions, useRoadmapWithProgress, useRoadmapMutations } from "@/hooks/useRoadmap";
import { useTasks } from "@/hooks/useTasks";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";

const RoadmapManager = () => {
  const { data: versions, isLoading: versionsLoading } = useRoadmapVersions();
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const { toggleDeliverable } = useRoadmapMutations();
  
  const { data: phasesWithProgress, isLoading: progressLoading } = useRoadmapWithProgress(
    selectedVersionId || versions?.[0]?.id
  );

  const currentVersionId = selectedVersionId || versions?.[0]?.id;

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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      in_progress: "secondary",
      blocked: "destructive",
      not_started: "outline",
      planned: "outline",
      on_hold: "destructive",
    };
    
    return (
      <Badge variant={variants[status] || "outline"}>
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
        </div>

        {versionsLoading ? (
          <Skeleton className="h-10 w-64 mb-8" />
        ) : (
          <div className="mb-8">
            <Select
              value={currentVersionId}
              onValueChange={setSelectedVersionId}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {versions?.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    v{version.version} - {version.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {progressLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {phasesWithProgress?.map((phase: any) => (
              <Card key={phase.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Phase {phase.phase_number}: {phase.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {phase.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(phase.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {phase.milestones?.map((milestone: any) => {
                      const milestoneTasks = allTasks?.filter(task => task.milestone_id === milestone.id) || [];
                      const isExpanded = expandedMilestones.has(milestone.id);
                      
                      return (
                        <div
                          key={milestone.id}
                          className="border rounded-lg p-4 space-y-3"
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
                                  Milestone {milestone.milestone_number}: {milestone.name}
                                </h4>
                              </button>
                              <p className="text-sm text-muted-foreground ml-10">
                                {milestone.description}
                              </p>
                            </div>
                            {getStatusBadge(milestone.status)}
                          </div>

                        {/* Deliverables with checkboxes */}
                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                          <div className="space-y-2 py-2">
                            <h5 className="text-sm font-semibold">Deliverables:</h5>
                            <div className="space-y-2">
                              {milestone.deliverables.map((deliverable: any, idx: number) => {
                                const isCompleted = deliverable.completed || false;
                                const completedCount = milestone.deliverables.filter((d: any) => d.completed).length;
                                
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

                        {milestone.progress && milestone.progress.total > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {milestone.progress.completed}/{milestone.progress.total} tasks ({milestone.progress.percentage}%)
                              </span>
                            </div>
                            <Progress value={milestone.progress.percentage} />
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>✓ {milestone.progress.completed} completed</span>
                              <span>⧗ {milestone.progress.inProgress} in progress</span>
                              <span>☐ {milestone.progress.total - milestone.progress.completed - milestone.progress.inProgress} todo</span>
                              {milestone.progress.blocked > 0 && (
                                <span className="text-destructive">⊗ {milestone.progress.blocked} blocked</span>
                              )}
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
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead className="text-right">Est. Hours</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {milestoneTasks.map((task) => (
                                    <TableRow key={task.id}>
                                      <TableCell>
                                        {getStatusBadge(task.status)}
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        {task.title}
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={
                                          task.priority === 'urgent' ? 'destructive' :
                                          task.priority === 'high' ? 'default' :
                                          task.priority === 'medium' ? 'secondary' :
                                          'outline'
                                        }>
                                          {task.priority}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {task.assigned_to_profile?.full_name || 'Unassigned'}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {task.estimated_hours || '-'}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
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
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RoadmapManager;
