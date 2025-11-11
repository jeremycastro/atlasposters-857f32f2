import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePartners = () => {
  return useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select(`
          *,
          atlas_manager:profiles!partners_atlas_manager_id_fkey(id, full_name, email),
          brands(id, brand_name, is_active),
          partner_contacts(id, full_name, email, designation, is_primary),
          partner_agreements(id, agreement_type, status, effective_date, expiration_date)
        `)
        .order("partner_name");

      if (error) throw error;
      return data;
    },
  });
};

export const usePartnerById = (partnerId: string | null) => {
  return useQuery({
    queryKey: ["partner", partnerId],
    queryFn: async () => {
      if (!partnerId) return null;

      const { data, error } = await supabase
        .from("partners")
        .select(`
          *,
          atlas_manager:profiles!partners_atlas_manager_id_fkey(id, full_name, email, avatar_url),
          brands(
            id, 
            brand_name, 
            description, 
            is_active,
            artworks(id, title, asc_code, status)
          ),
          partner_contacts(id, full_name, email, phone, designation, is_primary, user_id),
          partner_addresses(id, designation, address_line1, address_line2, city, state, postal_code, country, is_primary),
          partner_agreements(id, agreement_type, effective_date, expiration_date, royalty_rate, commission_rate, payment_period, status, agreement_document_path),
          partner_assets(id, asset_type, file_name, file_path, uploaded_at)
        `)
        .eq("id", partnerId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!partnerId,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select(`
          *,
          partner:partners(id, partner_name)
        `)
        .order("brand_name");

      if (error) throw error;
      return data;
    },
  });
};

export const usePartnerStats = () => {
  return useQuery({
    queryKey: ["partner-stats"],
    queryFn: async () => {
      const { data: partners, error: partnersError } = await supabase
        .from("partners")
        .select("id, status");

      if (partnersError) throw partnersError;

      const { data: brands, error: brandsError } = await supabase
        .from("brands")
        .select("id, is_active");

      if (brandsError) throw brandsError;

      const { data: agreements, error: agreementsError } = await supabase
        .from("partner_agreements")
        .select("id, status");

      if (agreementsError) throw agreementsError;

      return {
        totalPartners: partners?.length || 0,
        activePartners: partners?.filter(p => p.status === 'active').length || 0,
        totalBrands: brands?.length || 0,
        activeBrands: brands?.filter(b => b.is_active).length || 0,
        activeAgreements: agreements?.filter(a => a.status === 'active').length || 0,
      };
    },
  });
};
