import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PartnerProduct {
  id: string;
  partner_id: string;
  brand_id: string | null;
  artwork_id: string | null;
  source_table: string;
  source_record_id: string;
  artwork_code: string | null;
  original_title: string;
  original_sku: string | null;
  original_handle: string | null;
  product_type: string | null;
  vendor: string | null;
  variants: any[];
  import_method: string;
  import_status: string;
  imported_at: string;
  mapped_at: string | null;
  mapped_by: string | null;
  mapping_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  partner?: { partner_name: string };
  brand?: { brand_name: string };
  artwork?: { title: string; asc_code: string };
}

export const usePartnerProducts = (filters?: {
  import_status?: string;
  partner_id?: string;
  artwork_code?: string;
}) => {
  return useQuery({
    queryKey: ["partner_products", filters],
    queryFn: async () => {
      let query = supabase
        .from("partner_products")
        .select(`
          *,
          partner:partners(partner_name),
          brand:brands(brand_name),
          artwork:artworks(title, asc_code)
        `)
        .order("imported_at", { ascending: false });

      if (filters?.import_status && filters.import_status !== "all") {
        query = query.eq("import_status", filters.import_status);
      }
      if (filters?.partner_id) {
        query = query.eq("partner_id", filters.partner_id);
      }
      if (filters?.artwork_code) {
        query = query.ilike("artwork_code", `%${filters.artwork_code}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PartnerProduct[];
    },
  });
};

export const usePartnerProductStats = () => {
  return useQuery({
    queryKey: ["partner_products_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_products")
        .select("import_status");

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter((p) => p.import_status === "pending").length,
        reviewing: data.filter((p) => p.import_status === "reviewing").length,
        mapped: data.filter((p) => p.import_status === "mapped").length,
        created: data.filter((p) => p.import_status === "created").length,
        rejected: data.filter((p) => p.import_status === "rejected").length,
      };

      return stats;
    },
  });
};

export const useTranslateShopifyProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partnerId: string) => {
      // Fetch the store for this partner
      const { data: store, error: storeError } = await supabase
        .from("shopify_stores")
        .select("id")
        .eq("partner_id", partnerId)
        .single();

      if (storeError || !store) {
        throw new Error("No store found for this partner");
      }

      // Fetch shopify products for this store
      const { data: shopifyProducts, error: fetchError } = await supabase
        .from("shopify_products")
        .select("*")
        .eq("shopify_store_id", store.id);

      if (fetchError) throw fetchError;
      if (!shopifyProducts?.length) return { translated: 0, skipped: 0 };

      // Check which ones already exist in partner_products
      const { data: existing } = await supabase
        .from("partner_products")
        .select("source_record_id")
        .eq("source_table", "shopify_products");

      const existingIds = new Set(existing?.map((e) => e.source_record_id) || []);

      // Filter out already translated
      const toTranslate = shopifyProducts.filter(
        (sp) => !existingIds.has(sp.id)
      );

      if (!toTranslate.length) return { translated: 0, skipped: shopifyProducts.length };

      // Extract artwork codes from SKUs
      const extractArtworkCode = (sku: string): string | null => {
        if (!sku) return null;
        const parts = sku.split("-");
        if (parts.length >= 2) {
          return parts[parts.length - 1];
        }
        return null;
      };

      // Translate to partner_products
      const partnerProducts = toTranslate.map((sp) => {
        const rawData = sp.raw_data as any || {};
        const variants = rawData.variants || [];
        const artworkCodes = variants
          .map((v: any) => extractArtworkCode(v.sku))
          .filter(Boolean);
        const primaryArtworkCode = artworkCodes[0] || null;

        return {
          partner_id: partnerId,
          source_table: "shopify_products",
          source_record_id: sp.id,
          artwork_code: primaryArtworkCode,
          original_title: sp.title,
          original_sku: variants[0]?.sku || null,
          original_handle: sp.handle,
          product_type: sp.product_type,
          vendor: sp.vendor,
          variants: variants,
          import_method: "syncio" as const,
          import_status: "pending" as const,
        };
      });

      const { error: insertError } = await supabase
        .from("partner_products")
        .insert(partnerProducts);

      if (insertError) throw insertError;

      return { translated: partnerProducts.length, skipped: existingIds.size };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["partner_products"] });
      queryClient.invalidateQueries({ queryKey: ["partner_products_stats"] });
      toast.success(
        `Translated ${result.translated} products (${result.skipped} already existed)`
      );
    },
    onError: (error) => {
      console.error("Translation error:", error);
      toast.error("Failed to translate products");
    },
  });
};

export const useUpdatePartnerProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<PartnerProduct>;
    }) => {
      const { error } = await supabase
        .from("partner_products")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner_products"] });
      queryClient.invalidateQueries({ queryKey: ["partner_products_stats"] });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("Failed to update product");
    },
  });
};

export const useMapPartnerProductToArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      partnerProductId,
      artworkId,
      notes,
    }: {
      partnerProductId: string;
      artworkId: string;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("partner_products")
        .update({
          artwork_id: artworkId,
          import_status: "mapped",
          mapped_at: new Date().toISOString(),
          mapped_by: user?.id,
          mapping_notes: notes,
        })
        .eq("id", partnerProductId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner_products"] });
      queryClient.invalidateQueries({ queryKey: ["partner_products_stats"] });
      toast.success("Product mapped to artwork");
    },
    onError: (error) => {
      console.error("Mapping error:", error);
      toast.error("Failed to map product");
    },
  });
};

export const useRejectPartnerProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      reason,
    }: {
      id: string;
      reason: string;
    }) => {
      const { error } = await supabase
        .from("partner_products")
        .update({
          import_status: "rejected",
          rejection_reason: reason,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner_products"] });
      queryClient.invalidateQueries({ queryKey: ["partner_products_stats"] });
      toast.success("Product rejected");
    },
    onError: (error) => {
      console.error("Rejection error:", error);
      toast.error("Failed to reject product");
    },
  });
};
