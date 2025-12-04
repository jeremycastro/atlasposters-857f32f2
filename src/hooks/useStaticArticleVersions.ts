import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaticArticleVersion {
  id: string;
  slug: string;
  version_number: number;
  component_path: string;
  change_summary: string | null;
  archived_at: string;
  archived_by: string | null;
  is_current: boolean;
  created_at: string;
}

// Fetch all versions for a given slug
export function useStaticArticleVersions(slug: string | undefined) {
  return useQuery({
    queryKey: ["static-article-versions", slug],
    queryFn: async () => {
      if (!slug) return [];
      
      // Remove version suffix if present (e.g., "product-importing-v1" -> "product-importing")
      const baseSlug = slug.replace(/-v\d+$/, "");
      
      const { data, error } = await supabase
        .from("static_article_versions")
        .select("*")
        .eq("slug", baseSlug)
        .order("version_number", { ascending: false });

      if (error) throw error;
      return data as StaticArticleVersion[];
    },
    enabled: !!slug,
  });
}

// Fetch all static articles (grouped by slug, showing current version)
export function useAllStaticArticles() {
  return useQuery({
    queryKey: ["static-articles-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("static_article_versions")
        .select("*")
        .eq("is_current", true)
        .order("slug");

      if (error) throw error;
      return data as StaticArticleVersion[];
    },
  });
}

// Fetch a specific version
export function useStaticArticleVersion(slug: string | undefined, versionNumber: number | undefined) {
  return useQuery({
    queryKey: ["static-article-version", slug, versionNumber],
    queryFn: async () => {
      if (!slug || versionNumber === undefined) return null;
      
      const { data, error } = await supabase
        .from("static_article_versions")
        .select("*")
        .eq("slug", slug)
        .eq("version_number", versionNumber)
        .single();

      if (error) throw error;
      return data as StaticArticleVersion;
    },
    enabled: !!slug && versionNumber !== undefined,
  });
}

// Get current version number for a slug
export function useCurrentStaticVersion(slug: string | undefined) {
  return useQuery({
    queryKey: ["static-article-current", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("static_article_versions")
        .select("version_number")
        .eq("slug", slug)
        .eq("is_current", true)
        .single();

      if (error) throw error;
      return data?.version_number || 1;
    },
    enabled: !!slug,
  });
}

// Create a new archived version
export function useCreateStaticVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      componentPath,
      changeSummary,
    }: {
      slug: string;
      componentPath: string;
      changeSummary: string;
    }) => {
      // Get current max version number
      const { data: versions } = await supabase
        .from("static_article_versions")
        .select("version_number")
        .eq("slug", slug)
        .order("version_number", { ascending: false })
        .limit(1);

      const nextVersion = (versions?.[0]?.version_number || 0) + 1;

      // Mark all existing versions as not current
      await supabase
        .from("static_article_versions")
        .update({ is_current: false })
        .eq("slug", slug);

      // Insert new version as current
      const { data, error } = await supabase
        .from("static_article_versions")
        .insert({
          slug,
          version_number: nextVersion,
          component_path: componentPath,
          change_summary: changeSummary,
          is_current: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["static-article-versions", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["static-articles-all"] });
    },
  });
}

// Helper to parse versioned slugs
export function parseVersionedSlug(slug: string): { baseSlug: string; version: number | null } {
  const match = slug.match(/^(.+)-v(\d+)$/);
  if (match) {
    return {
      baseSlug: match[1],
      version: parseInt(match[2], 10),
    };
  }
  return { baseSlug: slug, version: null };
}
