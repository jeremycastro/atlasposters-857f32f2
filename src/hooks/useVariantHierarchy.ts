import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VariantGroup {
  id: string;
  group_name: string;
  description: string | null;
  product_type_id: string;
  sort_order: number;
  is_required: boolean;
  is_active: boolean;
  allow_multiple: boolean;
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
 * Hook to manage variant groups and their hierarchy per product type
 * Determines which variant dimension (color, size, finish) maps to VAR1, VAR2, VAR3
 */
export function useVariantHierarchy(productTypeId?: string) {
  const queryClient = useQueryClient();

  // Fetch variant groups for a product type
  const { data: variantGroups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['variant-groups', productTypeId],
    queryFn: async () => {
      const query = supabase
        .from('variant_groups')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (productTypeId) {
        query.eq('product_type_id', productTypeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VariantGroup[];
    },
    enabled: !!productTypeId,
  });

  // Fetch variant codes for specific groups
  const { data: variantCodes, isLoading: isLoadingCodes } = useQuery({
    queryKey: ['variant-codes', variantGroups?.map(g => g.id)],
    queryFn: async () => {
      if (!variantGroups || variantGroups.length === 0) return [];

      const { data, error } = await supabase
        .from('variant_codes')
        .select('*')
        .in('variant_group_id', variantGroups.map(g => g.id))
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as VariantCode[];
    },
    enabled: !!variantGroups && variantGroups.length > 0,
  });

  // Update variant group hierarchy (sort_order)
  const updateHierarchy = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      const promises = updates.map(({ id, sort_order }) =>
        supabase
          .from('variant_groups')
          .update({ sort_order })
          .eq('id', id)
      );

      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variant-groups'] });
      toast.success('Variant hierarchy updated');
    },
    onError: (error) => {
      toast.error('Failed to update hierarchy: ' + error.message);
    },
  });

  /**
   * Maps variant groups to VAR1, VAR2, VAR3 based on sort_order
   * sort_order 0 = VAR1, 1 = VAR2, 2 = VAR3
   */
  const getVariantMapping = () => {
    if (!variantGroups) return { var1: null, var2: null, var3: null };

    const sorted = [...variantGroups].sort((a, b) => a.sort_order - b.sort_order);
    
    return {
      var1: sorted[0] || null,
      var2: sorted[1] || null,
      var3: sorted[2] || null,
    };
  };

  /**
   * Get codes for a specific variant group
   */
  const getCodesForGroup = (groupId: string): VariantCode[] => {
    if (!variantCodes) return [];
    return variantCodes.filter(c => c.variant_group_id === groupId);
  };

  /**
   * Validates a variant code is in range 00-98
   */
  const isValidCode = (code: string): boolean => {
    const num = parseInt(code, 10);
    return /^\d{2}$/.test(code) && num >= 0 && num <= 98;
  };

  return {
    variantGroups,
    variantCodes,
    isLoading: isLoadingGroups || isLoadingCodes,
    updateHierarchy,
    getVariantMapping,
    getCodesForGroup,
    isValidCode,
  };
}
