import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoadmapVersions, useRoadmapWithProgress } from "@/hooks/useRoadmap";
import { CheckCircle2, Circle, Clock, AlertCircle, ArrowRight, Calendar, Target } from "lucide-react";
import { format } from "date-fns";

const Roadmap = () => {
  const { data: versions, isLoading: versionsLoading } = useRoadmapVersions();
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  
  const currentVersionId = selectedVersionId || versions?.find(v => v.status === 'current')?.id;
  const selectedVersion = versions?.find(v => v.id === currentVersionId);
  
  const { data: phasesWithProgress, isLoading: progressLoading } = useRoadmapWithProgress(
    currentVersionId
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
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
    
    const labels: Record<string, string> = {
      completed: "Completed",
      in_progress: "In Progress",
      blocked: "Blocked",
      not_started: "Not Started",
      planned: "Planned",
      on_hold: "On Hold",
    };
    
    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getVersionBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      current: "default",
      draft: "secondary",
      archived: "outline",
    };
    
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Atlas Posters Roadmap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track our journey from concept to reality. See what we're building, what's coming next, 
            and the progress we're making on each milestone.
          </p>
        </div>

        {/* Version Selector */}
        {versionsLoading ? (
          <div className="flex justify-center mb-12">
            <Skeleton className="h-12 w-80" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              <Select
                value={currentVersionId}
                onValueChange={setSelectedVersionId}
              >
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {versions?.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">v{version.version}</span>
                        <span>·</span>
                        <span>{version.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedVersion && getVersionBadge(selectedVersion.status)}
            </div>
            
            {selectedVersion?.release_date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Target: {format(new Date(selectedVersion.release_date), "MMMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Version Description */}
        {selectedVersion?.description && (
          <Card className="mb-12">
            <CardContent className="pt-6">
              <p className="text-lg text-center text-muted-foreground">
                {selectedVersion.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Phases and Milestones */}
        {progressLoading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {phasesWithProgress?.map((phase: any, phaseIndex: number) => (
              <Card key={phase.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-primary">
                          {phase.phase_number}
                        </span>
                        <CardTitle className="text-2xl">
                          {phase.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {phase.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(phase.status)}
                  </div>
                  
                  {(phase.start_date || phase.target_end_date) && (
                    <div className="flex gap-4 text-sm text-muted-foreground mt-4">
                      {phase.start_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {format(new Date(phase.start_date), "MMM d, yyyy")}</span>
                        </div>
                      )}
                      {phase.target_end_date && (
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span>Target: {format(new Date(phase.target_end_date), "MMM d, yyyy")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {phase.milestones?.map((milestone: any, milestoneIndex: number) => (
                      <div
                        key={milestone.id}
                        className="border rounded-lg p-6 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(milestone.status)}
                              <h4 className="text-xl font-semibold">
                                Milestone {milestone.milestone_number}: {milestone.name}
                              </h4>
                            </div>
                            <p className="text-muted-foreground">
                              {milestone.description}
                            </p>
                          </div>
                          {getStatusBadge(milestone.status)}
                        </div>

                        {/* Deliverables */}
                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold mb-2">Key Deliverables:</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {milestone.deliverables.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Progress Bar */}
                        {milestone.progress && milestone.progress.total > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">Task Progress</span>
                              <span className="text-muted-foreground">
                                {milestone.progress.completed}/{milestone.progress.total} tasks completed
                              </span>
                            </div>
                            <Progress 
                              value={milestone.progress.percentage} 
                              className="h-3"
                            />
                            <div className="flex flex-wrap gap-4 text-xs">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                {milestone.progress.completed} completed
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-blue-500" />
                                {milestone.progress.inProgress} in progress
                              </span>
                              <span className="flex items-center gap-1">
                                <Circle className="h-3 w-3 text-muted-foreground" />
                                {milestone.progress.total - milestone.progress.completed - milestone.progress.inProgress} todo
                              </span>
                              {milestone.progress.blocked > 0 && (
                                <span className="flex items-center gap-1 text-destructive">
                                  <AlertCircle className="h-3 w-3" />
                                  {milestone.progress.blocked} blocked
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">
                            No tasks assigned yet
                          </div>
                        )}

                        {/* Dates */}
                        {(milestone.due_date || milestone.target_week) && (
                          <div className="flex gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t">
                            {milestone.target_week && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Week {milestone.target_week}</span>
                              </div>
                            )}
                            {milestone.due_date && (
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                <span>Due: {format(new Date(milestone.due_date), "MMM d, yyyy")}</span>
                              </div>
                            )}
                            {milestone.completed_date && (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Completed: {format(new Date(milestone.completed_date), "MMM d, yyyy")}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold mb-4">
                Want to see the details?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Explore our technical documentation and changelog to see what we're building behind the scenes.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/techstack">
                  <Button variant="outline" size="lg">
                    View Tech Stack
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/changelog">
                  <Button variant="outline" size="lg">
                    Read Changelog
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
