import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Category {
  id: string;
  category_key: string;
  display_name: string;
  description: string | null;
  scope: string[];
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_hierarchical: boolean;
  allows_custom_tags: boolean;
  tag_count?: number;
}

export interface Tag {
  id: string;
  category_id: string;
  tag_key: string;
  display_name: string;
  description: string | null;
  tag_type: string;
  sort_order: number;
  usage_count: number;
  parent_tag_id: string | null;
}

export interface EntityTag {
  tag_id: string;
  category_key: string;
  category_name: string;
  tag_key: string;
  tag_name: string;
  tag_type: string;
  source: string;
  inherited_from_type: string | null;
  inherited_from_id: string | null;
  confidence_score: number | null;
}

// Fetch all categories
export const useCategories = (scope?: string) => {
  return useQuery({
    queryKey: ['categories', scope],
    queryFn: async () => {
      let query = supabase
        .from('category_definitions')
        .select(`
          *,
          tag_definitions!category_id(count)
        `)
        .eq('is_active', true)
        .order('sort_order');

      if (scope) {
        query = query.contains('scope', [scope]);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to include tag_count as a number
      return (data || []).map(category => ({
        ...category,
        tag_count: (category as any).tag_definitions?.[0]?.count || 0
      })) as Category[];
    },
  });
};

// Fetch tags for a category
export const useTags = (categoryKey: string) => {
  return useQuery({
    queryKey: ['tags', categoryKey],
    queryFn: async () => {
      const { data: category } = await supabase
        .from('category_definitions')
        .select('id')
        .eq('category_key', categoryKey)
        .single();

      if (!category) throw new Error('Category not found');

      const { data, error } = await supabase
        .from('tag_definitions')
        .select('*')
        .eq('category_id', category.id)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data as Tag[];
    },
    enabled: !!categoryKey,
  });
};

// Fetch all tags across all categories
export const useAllTags = () => {
  return useQuery({
    queryKey: ['all-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tag_definitions')
        .select(`
          *,
          category:category_definitions!category_id(
            category_key,
            display_name
          )
        `)
        .eq('is_active', true)
        .order('display_name');

      if (error) throw error;
      return data as (Tag & { category: { category_key: string; display_name: string } })[];
    },
  });
};

// Fetch all tags for an entity
export const useEntityTags = (entityType: string, entityId: string) => {
  return useQuery({
    queryKey: ['entity-tags', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_entity_tags', {
        p_entity_type: entityType,
        p_entity_id: entityId,
      });

      if (error) throw error;
      return data as EntityTag[];
    },
    enabled: !!entityType && !!entityId,
  });
};

// Add tag to entity
export const useTagEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      tagId,
      source = 'manual',
      confidenceScore,
    }: {
      entityType: string;
      entityId: string;
      tagId: string;
      source?: string;
      confidenceScore?: number;
    }) => {
      const { data, error } = await supabase
        .from('entity_tags')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          tag_id: tagId,
          source,
          confidence_score: confidenceScore,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['entity-tags', variables.entityType, variables.entityId] 
      });
      toast.success('Tag added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add tag');
    },
  });
};

// Remove tag from entity
export const useRemoveTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      tagId,
    }: {
      entityType: string;
      entityId: string;
      tagId: string;
    }) => {
      const { error } = await supabase
        .from('entity_tags')
        .delete()
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('tag_id', tagId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['entity-tags', variables.entityType, variables.entityId] 
      });
      toast.success('Tag removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove tag');
    },
  });
};

// Bulk add tags
export const useBulkTagEntities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      tagIds,
      source = 'manual',
    }: {
      entityType: string;
      entityId: string;
      tagIds: string[];
      source?: string;
    }) => {
      const inserts = tagIds.map((tagId) => ({
        entity_type: entityType,
        entity_id: entityId,
        tag_id: tagId,
        source,
      }));

      const { data, error } = await supabase
        .from('entity_tags')
        .insert(inserts)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['entity-tags', variables.entityType, variables.entityId] 
      });
      toast.success('Tags added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add tags');
    },
  });
};

// AI tag suggestions
export const useAITagSuggestions = (entityType: string, entityId: string) => {
  return useQuery({
    queryKey: ['tag-suggestions', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tag_suggestions')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!entityType && !!entityId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// Search entities by tags
export const useSearchByTags = () => {
  return useMutation({
    mutationFn: async ({
      entityType,
      tagIds,
      matchAll = false,
    }: {
      entityType: string;
      tagIds: string[];
      matchAll?: boolean;
    }) => {
      const { data, error } = await supabase.rpc('search_by_tags', {
        p_entity_type: entityType,
        p_tag_ids: tagIds,
        p_match_all: matchAll,
      });

      if (error) throw error;
      return data as { entity_id: string }[];
    },
  });
};

// Create custom tag
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryKey,
      tagKey,
      displayName,
      description,
    }: {
      categoryKey: string;
      tagKey: string;
      displayName: string;
      description?: string;
    }) => {
      const { data: category } = await supabase
        .from('category_definitions')
        .select('id')
        .eq('category_key', categoryKey)
        .single();

      if (!category) throw new Error('Category not found');

      const { data, error } = await supabase
        .from('tag_definitions')
        .insert({
          category_id: category.id,
          tag_key: tagKey,
          display_name: displayName,
          description,
          tag_type: 'custom',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Custom tag created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create tag');
    },
  });
};

// Update tag
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      displayName,
      description,
    }: {
      tagId: string;
      displayName: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('tag_definitions')
        .update({
          display_name: displayName,
          description,
        })
        .eq('id', tagId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update tag');
    },
  });
};

// Delete tag
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      // First delete all entity_tags references
      const { error: entityTagsError } = await supabase
        .from('entity_tags')
        .delete()
        .eq('tag_id', tagId);

      if (entityTagsError) throw entityTagsError;

      // Then delete the tag itself
      const { error } = await supabase
        .from('tag_definitions')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['entity-tags'] });
      toast.success('Tag deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete tag');
    },
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryKey,
      displayName,
      description,
      scope,
      icon,
      color,
      allowsCustomTags,
      isHierarchical,
    }: {
      categoryKey: string;
      displayName: string;
      description?: string;
      scope: string[];
      icon?: string;
      color?: string;
      allowsCustomTags?: boolean;
      isHierarchical?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('category_definitions')
        .insert({
          category_key: categoryKey,
          display_name: displayName,
          description,
          scope,
          icon,
          color,
          allows_custom_tags: allowsCustomTags,
          is_hierarchical: isHierarchical,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      displayName,
      description,
      icon,
      color,
      allowsCustomTags,
      isHierarchical,
    }: {
      categoryId: string;
      displayName: string;
      description?: string;
      icon?: string;
      color?: string;
      allowsCustomTags?: boolean;
      isHierarchical?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('category_definitions')
        .update({
          display_name: displayName,
          description,
          icon,
          color,
          allows_custom_tags: allowsCustomTags,
          is_hierarchical: isHierarchical,
        })
        .eq('id', categoryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category');
    },
  });
};
