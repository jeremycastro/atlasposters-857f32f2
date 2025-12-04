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

export interface ProductTypeVariantGroup {
  id: string;
  product_type_id: string;
  variant_group_id: string;
  sort_order: number;
  is_required: boolean;
  allow_multiple: boolean;
  created_at: string | null;
  variant_group?: VariantGroup;
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
 * Uses junction table product_type_variant_groups for many-to-many relationship
 */
export function useVariantHierarchy(productTypeId?: string) {
  const queryClient = useQueryClient();

  // Fetch variant groups for a product type via junction table
  const { data: productTypeVariantGroups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['product-type-variant-groups', productTypeId],
    queryFn: async () => {
      if (!productTypeId) return [];

      const { data, error } = await supabase
        .from('product_type_variant_groups')
        .select(`
          *,
          variant_group:variant_groups(*)
        `)
        .eq('product_type_id', productTypeId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as ProductTypeVariantGroup[];
    },
    enabled: !!productTypeId,
  });

  // Extract variant groups from junction data
  const variantGroups = productTypeVariantGroups
    ?.map(ptg => ptg.variant_group)
    .filter((vg): vg is VariantGroup => !!vg) || [];

  // Fetch variant codes for the groups
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

  // Update variant group hierarchy (sort_order in junction table)
  const updateHierarchy = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      const promises = updates.map(({ id, sort_order }) =>
        supabase
          .from('product_type_variant_groups')
          .update({ sort_order })
          .eq('id', id)
      );

      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-type-variant-groups'] });
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
    if (!productTypeVariantGroups) return { var1: null, var2: null, var3: null };

    const sorted = [...productTypeVariantGroups].sort((a, b) => a.sort_order - b.sort_order);
    
    return {
      var1: sorted[0]?.variant_group || null,
      var2: sorted[1]?.variant_group || null,
      var3: sorted[2]?.variant_group || null,
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
    productTypeVariantGroups,
    isLoading: isLoadingGroups || isLoadingCodes,
    updateHierarchy,
    getVariantMapping,
    getCodesForGroup,
    isValidCode,
  };
}
