import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BrandStoryComponent, BrandTimelineEvent, BrandComponentType, BrandStoryStatus, BrandStoryScope, BrandEventType } from "@/types/brandStory";

export const useCreateBrandStoryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      brand_id?: string | null;
      scope: BrandStoryScope;
      component_type: BrandComponentType;
      title: string;
      subtitle?: string;
      content: string;
      metadata?: Record<string, any>;
      status?: BrandStoryStatus;
      order_index?: number;
      tags?: string[];
    }) => {
      const { data: session } = await supabase.auth.getSession();
      
      const { data: result, error } = await supabase
        .from("brand_story_components")
        .insert({
          ...data,
          created_by: session.session?.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return result as BrandStoryComponent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandStoryComponents"] });
      queryClient.invalidateQueries({ queryKey: ["brandStoryStats"] });
      toast.success("Component created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create component: ${error.message}`);
    },
  });
};

export const useUpdateBrandStoryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<BrandStoryComponent> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("brand_story_components")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result as BrandStoryComponent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandStoryComponents"] });
      queryClient.invalidateQueries({ queryKey: ["brandStoryComponent"] });
      queryClient.invalidateQueries({ queryKey: ["brandStoryStats"] });
      toast.success("Component updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update component: ${error.message}`);
    },
  });
};

export const useDeleteBrandStoryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("brand_story_components")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandStoryComponents"] });
      queryClient.invalidateQueries({ queryKey: ["brandStoryStats"] });
      toast.success("Component deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete component: ${error.message}`);
    },
  });
};

export const useCreateTimelineEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      brand_id?: string | null;
      scope: BrandStoryScope;
      event_type: BrandEventType;
      title: string;
      content: string;
      event_date: string;
      related_components?: string[];
      related_tasks?: string[];
      featured_image_url?: string;
      tags?: string[];
      is_published?: boolean;
    }) => {
      const { data: session } = await supabase.auth.getSession();
      
      const { data: result, error } = await supabase
        .from("brand_story_timeline")
        .insert({
          ...data,
          created_by: session.session?.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return result as BrandTimelineEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["brandStoryStats"] });
      toast.success("Timeline event created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create timeline event: ${error.message}`);
    },
  });
};

export const useUpdateTimelineEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<BrandTimelineEvent> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("brand_story_timeline")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result as BrandTimelineEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["brandStoryStats"] });
      toast.success("Timeline event updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update timeline event: ${error.message}`);
    },
  });
};

export const useDeleteTimelineEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("brand_story_timeline")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["brandStoryStats"] });
      toast.success("Timeline event deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete timeline event: ${error.message}`);
    },
  });
};
