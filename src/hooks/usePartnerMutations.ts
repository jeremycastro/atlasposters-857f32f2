import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Partner, Brand } from "@/types/partner";

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      partner_name: string;
      website_url?: string;
      status: string;
      atlas_manager_id?: string;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: partner, error } = await (supabase as any)
        .from("partners")
        .insert({
          ...data,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return partner as Partner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partner-stats"] });
      toast.success("Partner created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create partner: ${error.message}`);
    },
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await (supabase as any)
        .from("partners")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Partner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      queryClient.invalidateQueries({ queryKey: ["partner-stats"] });
      toast.success("Partner updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update partner: ${error.message}`);
    },
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      partner_id: string;
      brand_name: string;
      description?: string;
    }) => {
      const { data: brand, error } = await (supabase as any)
        .from("brands")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return brand as Brand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      queryClient.invalidateQueries({ queryKey: ["partner-stats"] });
      toast.success("Brand created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create brand: ${error.message}`);
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await (supabase as any)
        .from("brands")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Brand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Brand updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update brand: ${error.message}`);
    },
  });
};

export const useCreateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: agreement, error } = await (supabase as any)
        .from("partner_agreements")
        .insert({
          ...data,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return agreement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      queryClient.invalidateQueries({ queryKey: ["partner-stats"] });
      toast.success("Agreement created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create agreement: ${error.message}`);
    },
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: contact, error } = await (supabase as any)
        .from("partner_contacts")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Contact created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create contact: ${error.message}`);
    },
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: address, error } = await (supabase as any)
        .from("partner_addresses")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Address created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create address: ${error.message}`);
    },
  });
};

export const useUpdateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await (supabase as any)
        .from("partner_agreements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      queryClient.invalidateQueries({ queryKey: ["partner-stats"] });
      toast.success("Agreement updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update agreement: ${error.message}`);
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await (supabase as any)
        .from("partner_contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Contact updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await (supabase as any)
        .from("partner_addresses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Address updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update address: ${error.message}`);
    },
  });
};
