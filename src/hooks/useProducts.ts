import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Product {
  id: string;
  product_name: string;
  base_sku: string;
  description: string | null;
  is_active: boolean;
  launch_date: string | null;
  discontinue_date: string | null;
  created_at: string;
  updated_at: string;
  artwork_id: string;
  product_type_id: string;
  artwork?: {
    id: string;
    title: string;
    asc_code: string;
    brand?: {
      id: string;
      brand_name: string;
      partner?: {
        id: string;
        partner_name: string;
      };
    };
  };
  product_type?: {
    id: string;
    type_name: string;
    type_code: string;
  };
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  full_sku: string;
  variant_code: string;
  variant_name: string | null;
  retail_price: number | null;
  wholesale_price: number | null;
  cost_price: number | null;
  inventory_qty: number | null;
  is_active: boolean;
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          artwork:artworks(
            id,
            title,
            asc_code,
            brand:brands(
              id,
              brand_name,
              partner:partners(
                id,
                partner_name
              )
            )
          ),
          product_type:product_types(
            id,
            type_name,
            type_code
          ),
          variants:product_variants(
            id,
            full_sku,
            variant_code,
            variant_name,
            retail_price,
            wholesale_price,
            cost_price,
            inventory_qty,
            is_active
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          artwork:artworks(
            id,
            title,
            asc_code,
            brand:brands(
              id,
              brand_name,
              partner:partners(
                id,
                partner_name
              )
            )
          ),
          product_type:product_types(
            id,
            type_name,
            type_code
          ),
          variants:product_variants(
            id,
            full_sku,
            variant_code,
            variant_name,
            retail_price,
            wholesale_price,
            cost_price,
            inventory_qty,
            is_active
          )
        `)
        .eq('id', productId)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!productId,
  });
}

export function useProductStats() {
  return useQuery({
    queryKey: ['product-stats'],
    queryFn: async () => {
      const [productsResult, variantsResult, typesResult] = await Promise.all([
        supabase.from('products').select('id, is_active'),
        supabase.from('product_variants').select('id, is_active'),
        supabase.from('product_types').select('id, is_active'),
      ]);

      if (productsResult.error) throw productsResult.error;
      if (variantsResult.error) throw variantsResult.error;
      if (typesResult.error) throw typesResult.error;

      const products = productsResult.data || [];
      const variants = variantsResult.data || [];
      const types = typesResult.data || [];

      return {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.is_active).length,
        totalVariants: variants.length,
        activeVariants: variants.filter(v => v.is_active).length,
        productTypes: types.filter(t => t.is_active).length,
      };
    },
  });
}

export function useProductTypes() {
  return useQuery({
    queryKey: ['product-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data;
    },
  });
}

export function useProductMutations() {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (data: {
      product_name: string;
      base_sku: string;
      artwork_id: string;
      product_type_id: string;
      description?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: product, error } = await supabase
        .from('products')
        .insert({
          ...data,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error.message}`);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Product>) => {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });

  return { createProduct, updateProduct, deleteProduct };
}
