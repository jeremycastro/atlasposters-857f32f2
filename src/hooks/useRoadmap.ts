import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRoadmapVersions = () => {
  return useQuery({
    queryKey: ["roadmap-versions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_versions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCurrentRoadmapVersion = () => {
  return useQuery({
    queryKey: ["roadmap-version-current"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_versions")
        .select("*")
        .eq("status", "current")
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useRoadmapPhases = (versionId?: string) => {
  return useQuery({
    queryKey: ["roadmap-phases", versionId],
    queryFn: async () => {
      let query = supabase
        .from("roadmap_phases")
        .select("*")
        .order("order_index", { ascending: true });

      if (versionId) {
        query = query.eq("version_id", versionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!versionId,
  });
};

export const useRoadmapMilestones = (phaseId?: string) => {
  return useQuery({
    queryKey: ["roadmap-milestones", phaseId],
    queryFn: async () => {
      let query = supabase
        .from("roadmap_milestones")
        .select("*, phase:roadmap_phases(name, phase_number)")
        .order("order_index", { ascending: true });

      if (phaseId) {
        query = query.eq("phase_id", phaseId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!phaseId,
  });
};

export const useAllRoadmapMilestones = () => {
  return useQuery({
    queryKey: ["roadmap-milestones-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_milestones")
        .select("*, phase:roadmap_phases(name, phase_number, version_id)")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useRoadmapWithProgress = (versionId?: string) => {
  return useQuery({
    queryKey: ["roadmap-with-progress", versionId],
    queryFn: async () => {
      // Fetch phases with their milestones
      let phasesQuery = supabase
        .from("roadmap_phases")
        .select("*, milestones:roadmap_milestones(*)")
        .order("order_index", { ascending: true })
        .order("milestones(order_index)", { ascending: true });

      if (versionId) {
        phasesQuery = phasesQuery.eq("version_id", versionId);
      }

      const { data: phases, error: phasesError } = await phasesQuery;
      if (phasesError) throw phasesError;

      // Fetch task counts for each milestone
      const phasesWithProgress = await Promise.all(
        phases.map(async (phase: any) => {
          const milestonesWithProgress = await Promise.all(
            (phase.milestones || []).map(async (milestone: any) => {
              const { data: tasks, error } = await supabase
                .from("project_tasks")
                .select("status")
                .eq("milestone_id", milestone.id);

              if (error) throw error;

              const total = tasks.length;
              const completed = tasks.filter((t) => t.status === "completed").length;
              const inProgress = tasks.filter((t) => t.status === "in_progress").length;
              const blocked = tasks.filter((t) => t.status === "blocked").length;

              return {
                ...milestone,
                progress: {
                  total,
                  completed,
                  inProgress,
                  blocked,
                  percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
                },
              };
            })
          );

          return {
            ...phase,
            milestones: milestonesWithProgress,
          };
        })
      );

      return phasesWithProgress;
    },
    enabled: !!versionId,
  });
};

export const useRoadmapMutations = () => {
  const queryClient = useQueryClient();

  const createPhase = useMutation({
    mutationFn: async (phase: any) => {
      const { data, error } = await supabase
        .from("roadmap_phases")
        .insert(phase)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-phases"] });
      toast.success("Phase created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create phase: " + error.message);
    },
  });

  const updatePhase = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("roadmap_phases")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-phases"] });
      toast.success("Phase updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update phase: " + error.message);
    },
  });

  const createMilestone = useMutation({
    mutationFn: async (milestone: any) => {
      const { data, error } = await supabase
        .from("roadmap_milestones")
        .insert(milestone)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-milestones"] });
      toast.success("Milestone created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create milestone: " + error.message);
    },
  });

  const updateMilestone = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("roadmap_milestones")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-milestones"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-with-progress"] });
      toast.success("Milestone updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update milestone: " + error.message);
    },
  });

  const toggleDeliverable = useMutation({
    mutationFn: async ({ milestoneId, deliverableIndex }: { milestoneId: string; deliverableIndex: number }) => {
      // Fetch current milestone
      const { data: milestone, error: fetchError } = await supabase
        .from("roadmap_milestones")
        .select("deliverables")
        .eq("id", milestoneId)
        .single();

      if (fetchError) throw fetchError;

      const deliverables = (milestone.deliverables || []) as any[];
      if (deliverableIndex >= deliverables.length) throw new Error("Invalid deliverable index");

      // Toggle the completed status
      const currentDeliverable = deliverables[deliverableIndex];
      deliverables[deliverableIndex] = {
        text: currentDeliverable.text || currentDeliverable,
        completed: !(currentDeliverable.completed || false),
      };

      // Update the milestone
      const { data, error } = await supabase
        .from("roadmap_milestones")
        .update({ deliverables })
        .eq("id", milestoneId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-milestones"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-with-progress"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update deliverable: " + error.message);
    },
  });

  return {
    createPhase,
    updatePhase,
    createMilestone,
    updateMilestone,
    toggleDeliverable,
  };
};
