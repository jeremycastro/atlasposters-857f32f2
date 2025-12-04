import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductType {
  id: string;
  type_code: string;
  type_name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductTypeVariantGroupInput {
  variant_group_id: string;
  sort_order: number;
  is_required?: boolean;
  allow_multiple?: boolean;
}

/**
 * Hook for product type CRUD operations
 */
export function useProductTypeMutations() {
  const queryClient = useQueryClient();

  // Create product type
  const createProductType = useMutation({
    mutationFn: async (productType: {
      type_code: string;
      type_name: string;
      description?: string;
      sort_order?: number;
    }) => {
      // Validate type_code format (3 uppercase letters)
      if (!/^[A-Z]{3}$/.test(productType.type_code)) {
        throw new Error('Type code must be exactly 3 uppercase letters');
      }

      const { data, error } = await supabase
        .from('product_types')
        .insert({
          type_code: productType.type_code,
          type_name: productType.type_name,
          description: productType.description || null,
          sort_order: productType.sort_order ?? 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
      toast.success('Product type created');
    },
    onError: (error) => {
      toast.error('Failed to create product type: ' + error.message);
    },
  });

  // Update product type
  const updateProductType = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductType> & { id: string }) => {
      // Validate type_code format if provided
      if (updates.type_code && !/^[A-Z]{3}$/.test(updates.type_code)) {
        throw new Error('Type code must be exactly 3 uppercase letters');
      }

      const { data, error } = await supabase
        .from('product_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
      toast.success('Product type updated');
    },
    onError: (error) => {
      toast.error('Failed to update product type: ' + error.message);
    },
  });

  // Delete product type
  const deleteProductType = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
      toast.success('Product type deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete product type: ' + error.message);
    },
  });

  // Assign variant groups to product type
  const assignVariantGroups = useMutation({
    mutationFn: async ({ 
      productTypeId, 
      variantGroups 
    }: { 
      productTypeId: string; 
      variantGroups: ProductTypeVariantGroupInput[] 
    }) => {
      // First, delete existing assignments
      const { error: deleteError } = await supabase
        .from('product_type_variant_groups')
        .delete()
        .eq('product_type_id', productTypeId);

      if (deleteError) throw deleteError;

      // Then, insert new assignments
      if (variantGroups.length > 0) {
        const { error: insertError } = await supabase
          .from('product_type_variant_groups')
          .insert(
            variantGroups.map(vg => ({
              product_type_id: productTypeId,
              variant_group_id: vg.variant_group_id,
              sort_order: vg.sort_order,
              is_required: vg.is_required ?? false,
              allow_multiple: vg.allow_multiple ?? false,
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-type-variant-groups'] });
      toast.success('Variant groups assigned');
    },
    onError: (error) => {
      toast.error('Failed to assign variant groups: ' + error.message);
    },
  });

  return {
    createProductType,
    updateProductType,
    deleteProductType,
    assignVariantGroups,
  };
}
