import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskActivityLogProps {
  taskId: string;
}

export const TaskActivityLog = ({ taskId }: TaskActivityLogProps) => {
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
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{activity.user?.full_name || "Unknown"}</span>
              <span className="text-xs text-muted-foreground">
                {activity.action}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </span>
            </div>
            {activity.old_value && activity.new_value && (
              <div className="mt-2 text-xs">
                <p className="text-muted-foreground">
                  Changed from: <span className="text-foreground">{JSON.stringify(activity.old_value)}</span>
                </p>
                <p className="text-muted-foreground">
                  To: <span className="text-foreground">{JSON.stringify(activity.new_value)}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
