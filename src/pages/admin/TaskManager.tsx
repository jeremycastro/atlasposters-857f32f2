import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, Table } from "lucide-react";
import { TaskKanbanView } from "@/components/tasks/TaskKanbanView";
import { TaskTableView } from "@/components/tasks/TaskTableView";
import { TaskStats } from "@/components/tasks/TaskStats";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TaskDetailDialog } from "@/components/tasks/TaskDetailDialog";
import { useTasks } from "@/hooks/useTasks";
import type { Database } from "@/integrations/supabase/types";
type Task = Database["public"]["Tables"]["project_tasks"]["Row"];
const TaskManager = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    assigned_to: "",
    search: ""
  });
  const {
    data: tasks = [],
    isLoading
  } = useTasks(filters);
  const handleViewTask = (task: Task) => {
    setSelectedTaskId(task.id);
    setDetailDialogOpen(true);
  };
  const handleEditTask = (task: Task) => {
    setSelectedTaskId(task.id);
    setDetailDialogOpen(true);
  };
  return <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
          
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <TaskStats tasks={tasks} />

      <Tabs value={view} onValueChange={v => setView(v as "kanban" | "table")} className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <TabsList>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Table
            </TabsTrigger>
          </TabsList>
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <TabsContent value="kanban" className="mt-0 w-full">
          {isLoading ? <p className="text-center text-muted-foreground py-8">Loading tasks...</p> : <TaskKanbanView tasks={tasks} onEditTask={handleEditTask} onViewTask={handleViewTask} />}
        </TabsContent>

        <TabsContent value="table" className="mt-0 w-full">
          {isLoading ? <p className="text-center text-muted-foreground py-8">Loading tasks...</p> : <TaskTableView tasks={tasks} onEditTask={handleEditTask} onViewTask={handleViewTask} />}
        </TabsContent>
      </Tabs>

      <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <TaskDetailDialog taskId={selectedTaskId} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />
    </div>;
};
export default TaskManager;