import { useState } from "react";
import { useRoadmapVersions, useRoadmapWithProgress } from "@/hooks/useRoadmap";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

const RoadmapManager = () => {
  const { data: versions, isLoading: versionsLoading } = useRoadmapVersions();
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  
  const { data: phasesWithProgress, isLoading: progressLoading } = useRoadmapWithProgress(
    selectedVersionId || versions?.[0]?.id
  );

  const currentVersionId = selectedVersionId || versions?.[0]?.id;

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
                    {phase.milestones?.map((milestone: any) => (
                      <div
                        key={milestone.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(milestone.status)}
                              <h4 className="font-semibold">
                                Milestone {milestone.milestone_number}: {milestone.name}
                              </h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {milestone.description}
                            </p>
                          </div>
                          {getStatusBadge(milestone.status)}
                        </div>

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

                        {milestone.progress?.total === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No tasks assigned to this milestone yet
                          </p>
                        )}
                      </div>
                    ))}
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
