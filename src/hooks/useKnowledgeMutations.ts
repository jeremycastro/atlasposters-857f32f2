import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateArticleInput {
  category_id: string;
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  tags?: string[];
  is_published?: boolean;
  initial_content: string;
  change_summary?: string;
}

interface UpdateArticleInput {
  id: string;
  category_id?: string;
  slug?: string;
  title?: string;
  description?: string;
  icon?: string;
  tags?: string[];
  is_published?: boolean;
}

interface CreateVersionInput {
  article_id: string;
  content_markdown: string;
  change_summary?: string;
}

// Create a new article with initial version
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateArticleInput) => {
      const { initial_content, change_summary, ...articleData } = input;

      // Create the article first
      const { data: article, error: articleError } = await supabase
        .from("knowledge_articles")
        .insert({
          category_id: articleData.category_id,
          slug: articleData.slug,
          title: articleData.title,
          description: articleData.description || null,
          icon: articleData.icon || null,
          tags: articleData.tags || [],
          is_published: articleData.is_published ?? false,
        })
        .select()
        .single();

      if (articleError) throw articleError;

      // Create initial version using the database function
      const { data: versionId, error: versionError } = await supabase
        .rpc("create_article_version", {
          p_article_id: article.id,
          p_content_markdown: initial_content,
          p_change_summary: change_summary || "Initial version",
        });

      if (versionError) throw versionError;

      return { article, versionId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-articles"] });
      toast.success("Article created successfully");
    },
    onError: (error: Error) => {
      console.error("Error creating article:", error);
      toast.error(`Failed to create article: ${error.message}`);
    },
  });
}

// Update article metadata (not content)
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateArticleInput) => {
      const { id, ...updates } = input;

      const { data, error } = await supabase
        .from("knowledge_articles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-articles"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-article", data.slug] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-article-by-id", data.id] });
      toast.success("Article updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating article:", error);
      toast.error(`Failed to update article: ${error.message}`);
    },
  });
}

// Delete an article and all its versions
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase
        .from("knowledge_articles")
        .delete()
        .eq("id", articleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-articles"] });
      toast.success("Article deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Error deleting article:", error);
      toast.error(`Failed to delete article: ${error.message}`);
    },
  });
}

// Create a new version for an existing article
export function useCreateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateVersionInput) => {
      const { data, error } = await supabase
        .rpc("create_article_version", {
          p_article_id: input.article_id,
          p_content_markdown: input.content_markdown,
          p_change_summary: input.change_summary || null,
        });

      if (error) throw error;
      return data as string;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-articles"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-article-versions", variables.article_id] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-article-by-id", variables.article_id] });
      toast.success("New version created successfully");
    },
    onError: (error: Error) => {
      console.error("Error creating version:", error);
      toast.error(`Failed to create version: ${error.message}`);
    },
  });
}

// Restore a previous version (creates a new version with old content)
export function useRestoreVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionId: string) => {
      const { data, error } = await supabase
        .rpc("restore_article_version", {
          p_version_id: versionId,
        });

      if (error) throw error;
      return data as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-articles"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-article-versions"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-article"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-article-by-id"] });
      toast.success("Version restored successfully");
    },
    onError: (error: Error) => {
      console.error("Error restoring version:", error);
      toast.error(`Failed to restore version: ${error.message}`);
    },
  });
}

// Publish/unpublish an article
export function useTogglePublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, isPublished }: { articleId: string; isPublished: boolean }) => {
      const { data, error } = await supabase
        .from("knowledge_articles")
        .update({ is_published: isPublished })
        .eq("id", articleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-articles"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-article", data.slug] });
      toast.success(data.is_published ? "Article published" : "Article unpublished");
    },
    onError: (error: Error) => {
      console.error("Error toggling publish:", error);
      toast.error(`Failed to update publish status: ${error.message}`);
    },
  });
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; display_name?: string; description?: string; icon?: string; color?: string; sort_order?: number }) => {
      const { data, error } = await supabase
        .from("knowledge_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating category:", error);
      toast.error(`Failed to update category: ${error.message}`);
    },
  });
}
