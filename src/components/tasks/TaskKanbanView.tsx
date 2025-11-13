import { TaskCard } from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskMutations } from "@/hooks/useTaskMutations";
import type { Database } from "@/integrations/supabase/types";

type Task = Database["public"]["Tables"]["project_tasks"]["Row"] & {
  assigned_to_profile?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

interface TaskKanbanViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
}

const statusColumns = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "testing", label: "Testing" },
  { id: "blocked", label: "Blocked" },
  { id: "completed", label: "Completed" },
];

export const TaskKanbanView = ({ tasks, onEditTask, onViewTask }: TaskKanbanViewProps) => {
  const { updateTask, deleteTask } = useTaskMutations();

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(id);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statusColumns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{column.label}</h3>
                <span className="text-sm text-muted-foreground">{columnTasks.length}</span>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3 pr-4">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={handleDelete}
                      onClick={onViewTask}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No tasks
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        );
      })}
    </div>
  );
};
