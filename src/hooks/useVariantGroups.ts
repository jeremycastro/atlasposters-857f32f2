import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VariantGroup {
  id: string;
  group_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface VariantCode {
  id: string;
  code: string;
  display_value: string;
  variant_group_id: string;
  display_order: number | null;
  description: string | null;
  is_active: boolean;
}

/**
 * Hook to manage shared variant groups and their codes
 */
export function useVariantGroups() {
  const queryClient = useQueryClient();

  // Fetch all variant groups
  const { data: variantGroups = [], isLoading } = useQuery({
    queryKey: ['variant-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variant_groups')
        .select('*')
        .order('group_name', { ascending: true });

      if (error) throw error;
      return data as VariantGroup[];
    },
  });

  // Fetch all variant codes
  const { data: allVariantCodes = [] } = useQuery({
    queryKey: ['all-variant-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variant_codes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as VariantCode[];
    },
  });

  // Create variant group
  const createGroup = useMutation({
    mutationFn: async (group: { group_name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('variant_groups')
        .insert({
          group_name: group.group_name,
          description: group.description || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variant-groups'] });
      toast.success('Variant group created');
    },
    onError: (error) => {
      toast.error('Failed to create group: ' + error.message);
    },
  });

  // Update variant group
  const updateGroup = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<VariantGroup> & { id: string }) => {
      const { data, error } = await supabase
        .from('variant_groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variant-groups'] });
      toast.success('Variant group updated');
    },
    onError: (error) => {
      toast.error('Failed to update group: ' + error.message);
    },
  });

  // Delete variant group
  const deleteGroup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('variant_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variant-groups'] });
      toast.success('Variant group deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete group: ' + error.message);
    },
  });

  // Create variant code
  const createCode = useMutation({
    mutationFn: async (code: { 
      variant_group_id: string; 
      code: string; 
      display_value: string; 
      description?: string;
      display_order?: number;
    }) => {
      const { data, error } = await supabase
        .from('variant_codes')
        .insert({
          variant_group_id: code.variant_group_id,
          code: code.code,
          display_value: code.display_value,
          description: code.description || null,
          display_order: code.display_order ?? 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-variant-codes'] });
      toast.success('Variant code created');
    },
    onError: (error) => {
      toast.error('Failed to create code: ' + error.message);
    },
  });

  // Update variant code
  const updateCode = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<VariantCode> & { id: string }) => {
      const { data, error } = await supabase
        .from('variant_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-variant-codes'] });
      toast.success('Variant code updated');
    },
    onError: (error) => {
      toast.error('Failed to update code: ' + error.message);
    },
  });

  // Delete variant code
  const deleteCode = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('variant_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-variant-codes'] });
      toast.success('Variant code deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete code: ' + error.message);
    },
  });

  // Get codes for a specific group
  const getCodesForGroup = (groupId: string): VariantCode[] => {
    return allVariantCodes.filter(c => c.variant_group_id === groupId);
  };

  // Get next available code for a group
  const getNextAvailableCode = (groupId: string): string => {
    const codes = getCodesForGroup(groupId);
    const usedCodes = new Set(codes.map(c => parseInt(c.code, 10)));
    
    for (let i = 0; i <= 98; i++) {
      if (!usedCodes.has(i)) {
        return i.toString().padStart(2, '0');
      }
    }
    return '99'; // fallback
  };

  return {
    variantGroups,
    allVariantCodes,
    isLoading,
    createGroup,
    updateGroup,
    deleteGroup,
    createCode,
    updateCode,
    deleteCode,
    getCodesForGroup,
    getNextAvailableCode,
  };
}
