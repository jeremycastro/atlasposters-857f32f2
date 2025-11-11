import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type TaskInsert = Database["public"]["Tables"]["project_tasks"]["Insert"];
type TaskUpdate = Database["public"]["Tables"]["project_tasks"]["Update"];

const logActivity = async (
  taskId: string,
  userId: string,
  action: string,
  oldValue?: any,
  newValue?: any
) => {
  await supabase.from("task_activity").insert({
    task_id: taskId,
    user_id: userId,
    action,
    old_value: oldValue,
    new_value: newValue,
  });
};

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: async (task: TaskInsert) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("project_tasks")
        .insert({ ...task, created_by: userData.user.id })
        .select()
        .single();

      if (error) throw error;

      await logActivity(data.id, userData.user.id, "created", null, data);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task created",
        description: "The task has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({
      id,
      updates,
      oldData,
    }: {
      id: string;
      updates: TaskUpdate;
      oldData?: any;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Filter out joined fields that aren't actual columns
      const validColumnFields: Record<string, any> = {};
      const joinedFields = ['assigned_to_profile', 'created_by_profile', 'phase_data', 'milestone_data'];
      
      Object.keys(updates).forEach((key) => {
        if (!joinedFields.includes(key)) {
          validColumnFields[key] = updates[key as keyof TaskUpdate];
        }
      });

      const { data, error } = await supabase
        .from("project_tasks")
        .update({ ...validColumnFields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(`
          *,
          assigned_to_profile:profiles!project_tasks_assigned_to_fkey(id, full_name, email),
          created_by_profile:profiles!project_tasks_created_by_fkey(id, full_name, email),
          phase_data:roadmap_phases(id, name, phase_number),
          milestone_data:roadmap_milestones(id, name, milestone_number)
        `)
        .single();

      if (error) throw error;

      await logActivity(id, userData.user.id, "updated", oldData, data);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("project_tasks").delete().eq("id", id);

      if (error) throw error;

      await logActivity(id, userData.user.id, "deleted", null, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    createTask,
    updateTask,
    deleteTask,
  };
};
