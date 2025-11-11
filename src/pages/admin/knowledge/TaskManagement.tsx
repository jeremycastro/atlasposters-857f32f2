import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, LayoutGrid, Table, MessageSquare, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TaskManagement = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link to="/admin/knowledge">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Task Management Process</h1>
          </div>
          <p className="text-muted-foreground">
            How to effectively use the task system for project tracking, collaboration, and milestone delivery
          </p>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Task System Overview</h2>
          <p className="text-foreground mb-4">
            The Atlas Task Management system is designed for tracking work, coordinating teams, 
            and maintaining visibility across all project activities. It combines Kanban-style 
            visual workflows with detailed task tracking to support both high-level planning 
            and granular execution.
          </p>
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <p className="font-semibold">Core Purpose:</p>
            <p className="text-sm text-muted-foreground">
              Transform project goals into actionable tasks, track progress transparently, 
              and ensure timely delivery through structured collaboration and clear accountability.
            </p>
          </div>
        </Card>

        {/* View Modes */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Dual View System</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-primary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <LayoutGrid className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Kanban View</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Visual board with drag-and-drop cards organized by status columns
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Best for:</strong> Sprint planning, workflow visualization</li>
                <li>• <strong>Columns:</strong> Todo → In Progress → In Review → Done</li>
                <li>• <strong>Interaction:</strong> Drag cards between columns to update status</li>
                <li>• <strong>Focus:</strong> High-level progress at a glance</li>
              </ul>
            </div>

            <div className="border-2 border-blue-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Table className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Table View</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Detailed list with sortable columns and comprehensive information
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Best for:</strong> Reporting, bulk review, detailed tracking</li>
                <li>• <strong>Columns:</strong> Title, Status, Priority, Assignee, Due Date</li>
                <li>• <strong>Interaction:</strong> Click rows to open full task details</li>
                <li>• <strong>Focus:</strong> Complete task information in structured format</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Status Workflow */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Status Workflow</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-slate-500/10 border-2 border-slate-500/30 rounded-lg">
              <Badge variant="secondary" className="text-base px-4 py-1">Todo</Badge>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Planned Work</p>
                <p className="text-xs text-muted-foreground">
                  Task is defined and ready to start but not yet begun. In backlog or sprint queue.
                </p>
              </div>
            </div>

            <div className="text-center text-muted-foreground">↓</div>

            <div className="flex items-center gap-4 p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-lg">
              <Badge className="text-base px-4 py-1 bg-blue-600">In Progress</Badge>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Active Work</p>
                <p className="text-xs text-muted-foreground">
                  Currently being worked on. Assignee is actively making progress toward completion.
                </p>
              </div>
            </div>

            <div className="text-center text-muted-foreground">↓</div>

            <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg">
              <Badge className="text-base px-4 py-1 bg-yellow-600">In Review</Badge>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Pending Review</p>
                <p className="text-xs text-muted-foreground">
                  Work complete, awaiting review, testing, or approval before final sign-off.
                </p>
              </div>
            </div>

            <div className="text-center text-muted-foreground">↓</div>

            <div className="flex items-center gap-4 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg">
              <Badge className="text-base px-4 py-1 bg-green-600">Done</Badge>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Completed</p>
                <p className="text-xs text-muted-foreground">
                  Task fully completed, reviewed, and delivered. No further action required.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-semibold mb-2">💡 Pro Tip: Always-Editable Status</p>
            <p className="text-sm text-muted-foreground">
              The status dropdown is always accessible at the top of task details without entering edit mode. 
              Quickly update progress without navigating through the full edit flow.
            </p>
          </div>
        </Card>

        {/* Priority Levels */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Priority System</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Badge className="bg-red-600 shrink-0">Critical</Badge>
              <div>
                <p className="font-semibold text-sm">Immediate Attention Required</p>
                <p className="text-xs text-muted-foreground">
                  Blockers, production issues, or time-sensitive deliverables. Drop everything else to address these.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <Badge className="bg-orange-600 shrink-0">High</Badge>
              <div>
                <p className="font-semibold text-sm">Important but Not Urgent</p>
                <p className="text-xs text-muted-foreground">
                  Key features or important bug fixes. Should be prioritized but not at expense of critical work.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Badge className="bg-blue-600 shrink-0">Medium</Badge>
              <div>
                <p className="font-semibold text-sm">Standard Priority</p>
                <p className="text-xs text-muted-foreground">
                  Regular tasks and improvements. Complete in normal workflow order.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-500/10 border border-slate-500/20 rounded-lg">
              <Badge variant="secondary" className="shrink-0">Low</Badge>
              <div>
                <p className="font-semibold text-sm">Nice to Have</p>
                <p className="text-xs text-muted-foreground">
                  Enhancements and non-essential improvements. Work on these when higher priorities are clear.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Collaboration Features */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Collaboration Tools</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Comments & Discussion</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Every task has a dedicated comments thread for team communication:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Ask questions and clarify requirements</li>
                <li>• Share updates on progress or blockers</li>
                <li>• Request reviews or additional input</li>
                <li>• Document decisions made during execution</li>
                <li>• @mention team members for notification (coming soon)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Activity Log</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Automatic tracking of all task changes with human-readable descriptions:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Status changes ("moved from Todo to In Progress")</li>
                <li>• Priority updates ("changed priority from Medium to High")</li>
                <li>• Assignee changes ("assigned to John Doe")</li>
                <li>• Due date modifications ("extended due date to Nov 15")</li>
                <li>• Field edits ("updated description")</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Assignee System</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Clear ownership and accountability for every task:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Assign tasks to specific team members</li>
                <li>• Filter tasks by assignee in both views</li>
                <li>• See your assigned tasks at a glance</li>
                <li>• Track team workload distribution</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Best Practices */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Task Management Best Practices</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>1</Badge> Write Clear, Actionable Titles
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Good titles start with verbs and clearly state the outcome:
              </p>
              <div className="space-y-1 ml-4">
                <p className="text-xs text-green-600">✓ "Create partner onboarding workflow documentation"</p>
                <p className="text-xs text-green-600">✓ "Fix logo upload bug in brand management"</p>
                <p className="text-xs text-red-600">✗ "Documentation"</p>
                <p className="text-xs text-red-600">✗ "Bug"</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>2</Badge> Add Detailed Descriptions
              </h3>
              <p className="text-sm text-muted-foreground">
                Include context, acceptance criteria, and relevant links. Future you (and your teammates) 
                will appreciate having all the information in one place.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>3</Badge> Set Realistic Due Dates
              </h3>
              <p className="text-sm text-muted-foreground">
                Consider dependencies, complexity, and other commitments. It's better to deliver 
                early than to constantly push deadlines.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>4</Badge> Update Status Promptly
              </h3>
              <p className="text-sm text-muted-foreground">
                Keep status current so the team has accurate visibility. Move tasks to "In Progress" 
                when you start, "In Review" when ready, and "Done" immediately upon completion.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>5</Badge> Comment on Blockers Immediately
              </h3>
              <p className="text-sm text-muted-foreground">
                Don't let blockers sit silently. Add a comment explaining what's blocking progress 
                so the team can help unblock or reprioritize.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>6</Badge> Review Activity Logs
              </h3>
              <p className="text-sm text-muted-foreground">
                Check the activity log to understand task history before making changes. 
                This prevents undoing decisions or missing important context.
              </p>
            </div>
          </div>
        </Card>

        {/* Task Lifecycle */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Complete Task Lifecycle</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border-l-4 border-primary pl-3">
              <div className="font-bold text-primary">1</div>
              <div>
                <p className="font-semibold text-sm">Creation</p>
                <p className="text-xs text-muted-foreground">
                  Task created with title, description, priority, and optional assignee/due date
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-l-4 border-blue-600 pl-3">
              <div className="font-bold text-blue-600">2</div>
              <div>
                <p className="font-semibold text-sm">Assignment</p>
                <p className="text-xs text-muted-foreground">
                  Team member assigned, acknowledges task, and asks clarifying questions in comments
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-l-4 border-purple-600 pl-3">
              <div className="font-bold text-purple-600">3</div>
              <div>
                <p className="font-semibold text-sm">Execution</p>
                <p className="text-xs text-muted-foreground">
                  Status updated to "In Progress", work completed, progress updates posted in comments
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-l-4 border-yellow-600 pl-3">
              <div className="font-bold text-yellow-600">4</div>
              <div>
                <p className="font-semibold text-sm">Review</p>
                <p className="text-xs text-muted-foreground">
                  Moved to "In Review", stakeholder reviews work, provides feedback via comments
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-l-4 border-green-600 pl-3">
              <div className="font-bold text-green-600">5</div>
              <div>
                <p className="font-semibold text-sm">Completion</p>
                <p className="text-xs text-muted-foreground">
                  Approved and moved to "Done", activity log shows complete task history
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Version 0.4.0</strong> - Task Management Process - Admin Knowledge Base
          </p>
        </div>
      </main>
    </div>
  );
};

export default TaskManagement;
