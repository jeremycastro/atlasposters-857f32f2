import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfiles } from "@/hooks/useProfiles";

interface TaskActivityLogProps {
  taskId: string;
}

const formatFieldName = (field: string): string => {
  const fieldMap: Record<string, string> = {
    status: "Status",
    priority: "Priority",
    assigned_to: "Assignee",
    title: "Title",
    description: "Description",
    due_date: "Due Date",
    estimated_hours: "Estimated Hours",
    phase_id: "Phase",
    milestone_id: "Milestone",
    tags: "Tags",
  };
  return fieldMap[field] || field;
};

const formatFieldValue = (field: string, value: any, profiles: any[]): string => {
  if (value === null || value === undefined) return "None";
  
  switch (field) {
    case "status":
      const statusMap: Record<string, string> = {
        backlog: "Backlog",
        todo: "To Do",
        in_progress: "In Progress",
        in_review: "In Review",
        done: "Done",
      };
      return statusMap[value] || value;
    
    case "priority":
      const priorityMap: Record<string, string> = {
        low: "Low",
        medium: "Medium",
        high: "High",
        urgent: "Urgent",
      };
      return priorityMap[value] || value;
    
    case "assigned_to":
      const profile = profiles.find(p => p.id === value);
      return profile?.full_name || "Unassigned";
    
    case "due_date":
      return new Date(value).toLocaleDateString();
    
    case "tags":
      return Array.isArray(value) ? value.join(", ") : value;
    
    default:
      return String(value);
  }
};

const getChangeDescription = (activity: any, profiles: any[]): string => {
  if (activity.action === "created") {
    return "created this task";
  }
  
  if (activity.action === "deleted") {
    return "deleted this task";
  }
  
  // For updates, extract the field that changed
  if (activity.old_value && activity.new_value) {
    const oldKeys = Object.keys(activity.old_value);
    const newKeys = Object.keys(activity.new_value);
    const changedFields = [...new Set([...oldKeys, ...newKeys])];
    
    if (changedFields.length === 1) {
      const field = changedFields[0];
      const oldValue = formatFieldValue(field, activity.old_value[field], profiles);
      const newValue = formatFieldValue(field, activity.new_value[field], profiles);
      return `changed ${formatFieldName(field)} from "${oldValue}" to "${newValue}"`;
    } else if (changedFields.length > 1) {
      return `updated multiple fields: ${changedFields.map(formatFieldName).join(", ")}`;
    }
  }
  
  return activity.action;
};

export const TaskActivityLog = ({ taskId }: TaskActivityLogProps) => {
  const { data: profiles = [] } = useProfiles();
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ["task-activity", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_activity")
        .select(`
          *,
          user:profiles(full_name)
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading activity...</p>;
  }

  if (!activities || activities.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>;
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {activities.map((activity: any) => (
          <div key={activity.id} className="border-l-2 border-border pl-4 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{activity.user?.full_name || "Unknown"}</span>
                <span className="text-sm text-foreground">
                  {getChangeDescription(activity, profiles)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
