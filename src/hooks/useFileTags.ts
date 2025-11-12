import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FileTag {
  id: string;
  category: string;
  tag_value: string;
  display_name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface TagCategory {
  category: string;
  tags: FileTag[];
}

export const useFileTags = () => {
  return useQuery({
    queryKey: ['file-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_tags')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order');

      if (error) throw error;

      // Group tags by category
      const grouped = (data || []).reduce((acc, tag) => {
        if (!acc[tag.category]) {
          acc[tag.category] = [];
        }
        acc[tag.category].push(tag);
        return acc;
      }, {} as Record<string, FileTag[]>);

      return Object.entries(grouped).map(([category, tags]) => ({
        category,
        tags,
      })) as TagCategory[];
    },
  });
};

export const useFileTagsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['file-tags', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_tags')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data as FileTag[];
    },
  });
};
