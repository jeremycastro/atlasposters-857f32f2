import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBrandStoryAttachments = (componentId?: string, timelineEventId?: string) => {
  return useQuery({
    queryKey: ['brand-story-attachments', componentId, timelineEventId],
    queryFn: async () => {
      let query = supabase
        .from('brand_story_assets')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (componentId) {
        query = query.eq('component_id', componentId);
      }

      if (timelineEventId) {
        query = query.eq('timeline_event_id', timelineEventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!(componentId || timelineEventId),
  });
};
