import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandStoryComponent, BrandTimelineEvent, BrandStoryAsset, BrandStoryStats, BrandComponentType, BrandStoryStatus, BrandStoryScope } from "@/types/brandStory";

export const useBrandStoryComponents = (
  brandId?: string | null,
  options?: {
    componentTypes?: BrandComponentType[];
    status?: BrandStoryStatus;
    scope?: BrandStoryScope;
  }
) => {
  return useQuery({
    queryKey: ["brandStoryComponents", brandId, options],
    queryFn: async () => {
      let query = supabase
        .from("brand_story_components")
        .select("*")
        .eq("is_current_version", true)
        .order("order_index", { ascending: true });

      if (brandId) {
        query = query.eq("brand_id", brandId);
      }

      if (options?.scope) {
        query = query.eq("scope", options.scope);
      }

      if (options?.componentTypes?.length) {
        query = query.in("component_type", options.componentTypes);
      }

      if (options?.status) {
        query = query.eq("status", options.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BrandStoryComponent[];
    },
  });
};

export const useBrandStoryComponent = (componentId: string) => {
  return useQuery({
    queryKey: ["brandStoryComponent", componentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_story_components")
        .select("*")
        .eq("id", componentId)
        .single();

      if (error) throw error;
      return data as BrandStoryComponent;
    },
    enabled: !!componentId,
  });
};

export const useBrandStoryComponentVersions = (componentId: string) => {
  return useQuery({
    queryKey: ["brandStoryComponentVersions", componentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_story_components")
        .select("*")
        .or(`id.eq.${componentId},parent_version_id.eq.${componentId}`)
        .order("version_number", { ascending: false });

      if (error) throw error;
      return data as BrandStoryComponent[];
    },
    enabled: !!componentId,
  });
};

export const useBrandTimeline = (
  brandIds?: string[],
  options?: {
    includeGlobal?: boolean;
    publishedOnly?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["brandTimeline", brandIds, options],
    queryFn: async () => {
      let query = supabase
        .from("brand_story_timeline")
        .select(`
          *,
          brands!brand_story_timeline_brand_id_fkey (
            id,
            brand_name,
            primary_color
          )
        `)
        .order("event_date", { ascending: false });

      // Build conditions for filtering
      const conditions: string[] = [];

      if (brandIds && brandIds.length > 0) {
        const brandIdList = brandIds.map(id => `brand_id.eq.${id}`).join(',');
        conditions.push(`or(${brandIdList})`);
      }

      if (options?.includeGlobal) {
        conditions.push("scope.eq.atlas_global");
      }

      // Apply OR conditions if any
      if (conditions.length > 0) {
        if (conditions.length === 1) {
          // Single condition, use it directly
          const condition = conditions[0];
          if (condition.startsWith('or(')) {
            query = query.or(condition.replace('or(', '').replace(')', ''));
          } else {
            query = query.eq("scope", "atlas_global");
          }
        } else {
          // Multiple conditions, combine with OR
          const brandCondition = conditions.find(c => c.startsWith('or('));
          if (brandCondition && options?.includeGlobal) {
            const brandIds = brandCondition.replace('or(', '').replace(')', '');
            query = query.or(`${brandIds},scope.eq.atlas_global`);
          }
        }
      }

      if (options?.publishedOnly) {
        query = query.eq("is_published", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BrandTimelineEvent[];
    },
  });
};

export const useBrandStoryAssets = (
  componentId?: string,
  timelineEventId?: string
) => {
  return useQuery({
    queryKey: ["brandStoryAssets", componentId, timelineEventId],
    queryFn: async () => {
      let query = supabase.from("brand_story_assets").select("*");

      if (componentId) {
        query = query.eq("component_id", componentId);
      }

      if (timelineEventId) {
        query = query.eq("timeline_event_id", timelineEventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as BrandStoryAsset[];
    },
    enabled: !!componentId || !!timelineEventId,
  });
};

export const useBrandStoryStats = (brandId?: string | null) => {
  return useQuery({
    queryKey: ["brandStoryStats", brandId],
    queryFn: async () => {
      let componentsQuery = supabase
        .from("brand_story_components")
        .select("*", { count: "exact" })
        .eq("is_current_version", true);

      if (brandId) {
        componentsQuery = componentsQuery.eq("brand_id", brandId);
      }

      let timelineQuery = supabase
        .from("brand_story_timeline")
        .select("*", { count: "exact" });

      if (brandId) {
        timelineQuery = timelineQuery.eq("brand_id", brandId);
      }

      let assetsQuery = supabase
        .from("brand_story_assets")
        .select("*", { count: "exact" });

      let exportsQuery = supabase
        .from("brand_story_exports")
        .select("*", { count: "exact" });

      if (brandId) {
        exportsQuery = exportsQuery.eq("brand_id", brandId);
      }

      const [
        { data: components, count: componentsCount, error: componentsError },
        { count: timelineCount, error: timelineError },
        { count: assetsCount, error: assetsError },
        { count: exportsCount, error: exportsError },
      ] = await Promise.all([
        componentsQuery,
        timelineQuery,
        assetsQuery,
        exportsQuery,
      ]);

      if (componentsError) throw componentsError;
      if (timelineError) throw timelineError;
      if (assetsError) throw assetsError;
      if (exportsError) throw exportsError;

      const componentsByType: Record<string, number> = {};
      const componentsByStatus: Record<string, number> = {};

      components?.forEach((component) => {
        componentsByType[component.component_type] =
          (componentsByType[component.component_type] || 0) + 1;
        componentsByStatus[component.status] =
          (componentsByStatus[component.status] || 0) + 1;
      });

      return {
        totalComponents: componentsCount || 0,
        componentsByType,
        componentsByStatus,
        totalTimelineEvents: timelineCount || 0,
        totalAssets: assetsCount || 0,
        totalExports: exportsCount || 0,
        recentActivity: [],
      } as BrandStoryStats;
    },
  });
};
