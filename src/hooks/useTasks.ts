import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Task = Database["public"]["Tables"]["project_tasks"]["Row"] & {
  assigned_to_profile?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  created_by_profile?: {
    id: string;
    full_name: string | null;
  } | null;
};

interface TaskFilters {
  status?: string[];
  priority?: string[];
  assigned_to?: string;
  created_by?: string;
  tags?: string[];
  phase?: string;
  milestone?: string;
  phase_id?: string;
  milestone_id?: string;
  search?: string;
}

export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      let query = supabase
        .from("project_tasks")
        .select(`
          *,
          assigned_to_profile:profiles!project_tasks_assigned_to_fkey(id, full_name, avatar_url),
          created_by_profile:profiles!project_tasks_created_by_fkey(id, full_name)
        `)
        .order("order_index", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status.length > 0) {
        query = query.in("status", filters.status as any);
      }

      if (filters?.priority && filters.priority.length > 0) {
        query = query.in("priority", filters.priority as any);
      }

      if (filters?.assigned_to) {
        query = query.eq("assigned_to", filters.assigned_to);
      }

      if (filters?.created_by) {
        query = query.eq("created_by", filters.created_by);
      }

      if (filters?.phase) {
        query = query.eq("phase", filters.phase);
      }

      if (filters?.milestone) {
        query = query.eq("milestone", filters.milestone);
      }

      if (filters?.phase_id) {
        query = query.eq("phase_id", filters.phase_id);
      }

      if (filters?.milestone_id) {
        query = query.eq("milestone_id", filters.milestone_id);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps("tags", filters.tags);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,reference_number.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Task[];
    },
  });
};

export const useTaskById = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      if (!taskId) return null;

      const { data, error } = await supabase
        .from("project_tasks")
        .select(`
          *,
          assigned_to_profile:profiles!project_tasks_assigned_to_fkey(id, full_name, avatar_url),
          created_by_profile:profiles!project_tasks_created_by_fkey(id, full_name),
          phase_data:roadmap_phases!project_tasks_phase_id_fkey(id, phase_number, name),
          milestone_data:roadmap_milestones!project_tasks_milestone_id_fkey(id, milestone_number, name)
        `)
        .eq("id", taskId)
        .single();

      if (error) throw error;
      return data as Task & {
        phase_data?: { id: string; phase_number: number; name: string } | null;
        milestone_data?: { id: string; milestone_number: string; name: string } | null;
      };
    },
    enabled: !!taskId,
  });
};
