import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface KnowledgeCategory {
  id: string;
  category_key: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeArticle {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  tags: string[];
  is_published: boolean;
  current_version_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: KnowledgeCategory;
  current_version?: KnowledgeArticleVersion;
}

export interface KnowledgeArticleVersion {
  id: string;
  article_id: string;
  version_number: number;
  content_markdown: string;
  change_summary: string | null;
  created_by: string | null;
  created_at: string;
  author?: {
    full_name: string | null;
    email: string | null;
  };
}

// Fetch all categories
export function useKnowledgeCategories() {
  return useQuery({
    queryKey: ["knowledge-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      return data as KnowledgeCategory[];
    },
  });
}

// Fetch all articles with their categories
export function useKnowledgeArticles(options?: { 
  publishedOnly?: boolean;
  categoryKey?: string;
}) {
  return useQuery({
    queryKey: ["knowledge-articles", options],
    queryFn: async () => {
      let query = supabase
        .from("knowledge_articles")
        .select(`
          *,
          category:knowledge_categories(*)
        `)
        .order("updated_at", { ascending: false });

      if (options?.publishedOnly) {
        query = query.eq("is_published", true);
      }

      if (options?.categoryKey) {
        query = query.eq("category.category_key", options.categoryKey);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as KnowledgeArticle[];
    },
  });
}

// Fetch a single article by slug with current version content
export function useKnowledgeArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ["knowledge-article", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data: article, error: articleError } = await supabase
        .from("knowledge_articles")
        .select(`
          *,
          category:knowledge_categories(*)
        `)
        .eq("slug", slug)
        .single();

      if (articleError) throw articleError;

      // Fetch current version content if exists
      if (article.current_version_id) {
        const { data: version, error: versionError } = await supabase
          .from("knowledge_article_versions")
          .select("*")
          .eq("id", article.current_version_id)
          .single();

        if (versionError && versionError.code !== "PGRST116") {
          // Ignore "not found" errors, throw others
          throw versionError;
        }

        // Fetch author profile separately if needed
        let author = null;
        if (version?.created_by) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", version.created_by)
            .single();
          author = profile;
        }

        return { 
          ...article, 
          current_version: { ...version, author } 
        } as KnowledgeArticle;
      }

      return article as KnowledgeArticle;
    },
    enabled: !!slug,
  });
}

// Fetch article by ID
export function useKnowledgeArticleById(articleId: string | undefined) {
  return useQuery({
    queryKey: ["knowledge-article-by-id", articleId],
    queryFn: async () => {
      if (!articleId) return null;

      const { data: article, error: articleError } = await supabase
        .from("knowledge_articles")
        .select(`
          *,
          category:knowledge_categories(*)
        `)
        .eq("id", articleId)
        .single();

      if (articleError) throw articleError;

      // Fetch current version content if exists
      if (article.current_version_id) {
        const { data: version, error: versionError } = await supabase
          .from("knowledge_article_versions")
          .select("*")
          .eq("id", article.current_version_id)
          .single();

        if (!versionError) {
          return { ...article, current_version: version } as KnowledgeArticle;
        }
      }

      return article as KnowledgeArticle;
    },
    enabled: !!articleId,
  });
}

// Fetch version history for an article
export function useArticleVersions(articleId: string | undefined) {
  return useQuery({
    queryKey: ["knowledge-article-versions", articleId],
    queryFn: async () => {
      if (!articleId) return [];

      const { data: versions, error } = await supabase
        .from("knowledge_article_versions")
        .select("*")
        .eq("article_id", articleId)
        .order("version_number", { ascending: false });

      if (error) throw error;

      // Fetch author profiles for all versions
      const authorIds = [...new Set(versions.filter(v => v.created_by).map(v => v.created_by!))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", authorIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return versions.map(v => ({
        ...v,
        author: v.created_by ? profileMap.get(v.created_by) : null
      })) as KnowledgeArticleVersion[];
    },
    enabled: !!articleId,
  });
}

// Fetch a specific version by ID
export function useArticleVersion(versionId: string | undefined) {
  return useQuery({
    queryKey: ["knowledge-article-version", versionId],
    queryFn: async () => {
      if (!versionId) return null;

      const { data: version, error } = await supabase
        .from("knowledge_article_versions")
        .select("*")
        .eq("id", versionId)
        .single();

      if (error) throw error;

      // Fetch related article
      const { data: article } = await supabase
        .from("knowledge_articles")
        .select("title, slug")
        .eq("id", version.article_id)
        .single();

      // Fetch author profile
      let author = null;
      if (version.created_by) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", version.created_by)
          .single();
        author = profile;
      }

      return { ...version, author, article } as KnowledgeArticleVersion & { article: { title: string; slug: string } };
    },
    enabled: !!versionId,
  });
}

// Search articles by title, description, or tags
export function useSearchKnowledgeArticles(searchTerm: string) {
  return useQuery({
    queryKey: ["knowledge-articles-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      const { data, error } = await supabase
        .from("knowledge_articles")
        .select(`
          *,
          category:knowledge_categories(*)
        `)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .eq("is_published", true)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as KnowledgeArticle[];
    },
    enabled: searchTerm.length >= 2,
  });
}
