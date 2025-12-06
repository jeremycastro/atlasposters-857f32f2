import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Partner, Brand } from "@/types/partner";
import {
  partnerCreateSchema,
  partnerUpdateSchema,
  brandCreateSchema,
  brandUpdateSchema,
  contactCreateSchema,
  contactUpdateSchema,
  addressCreateSchema,
  addressUpdateSchema,
  agreementCreateSchema,
  agreementUpdateSchema,
  type PartnerCreate,
  type PartnerUpdate,
  type BrandCreate,
  type BrandUpdate,
  type ContactCreate,
  type ContactUpdate,
  type AddressCreate,
  type AddressUpdate,
  type AgreementCreate,
  type AgreementUpdate,
} from "@/lib/validations/partnerSchemas";

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PartnerCreate) => {
      // Validate input
      const validated = partnerCreateSchema.parse(data);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Clean empty strings to null for optional fields
      const cleanedData = {
        ...validated,
        website_url: validated.website_url || null,
        atlas_manager_id: validated.atlas_manager_id || null,
        notes: validated.notes || null,
      };

      const { data: partner, error } = await (supabase as any)
        .from("partners")
        .insert({
          ...cleanedData,
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
    mutationFn: async ({ id, updates }: { id: string; updates: PartnerUpdate }) => {
      // Validate input
      const validated = partnerUpdateSchema.parse(updates);
      
      // Clean empty strings to null for optional fields
      const cleanedUpdates: Record<string, unknown> = { ...validated };
      if (cleanedUpdates.website_url === "") cleanedUpdates.website_url = null;
      if (cleanedUpdates.atlas_manager_id === "") cleanedUpdates.atlas_manager_id = null;
      
      const { data, error } = await (supabase as any)
        .from("partners")
        .update(cleanedUpdates)
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
    mutationFn: async (data: BrandCreate) => {
      // Validate input
      const validated = brandCreateSchema.parse(data);
      
      // Clean empty strings to null
      const cleanedData = {
        ...validated,
        description: validated.description || null,
        tagline: validated.tagline || null,
        website_url: validated.website_url || null,
        primary_color: validated.primary_color || null,
        secondary_color: validated.secondary_color || null,
        accent_color: validated.accent_color || null,
      };

      const { data: brand, error } = await (supabase as any)
        .from("brands")
        .insert(cleanedData)
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
    mutationFn: async ({ id, updates }: { id: string; updates: BrandUpdate }) => {
      // Validate input
      const validated = brandUpdateSchema.parse(updates);
      
      // Clean empty strings to null
      const cleanedUpdates: Record<string, unknown> = { ...validated };
      if (cleanedUpdates.website_url === "") cleanedUpdates.website_url = null;
      if (cleanedUpdates.primary_color === "") cleanedUpdates.primary_color = null;
      if (cleanedUpdates.secondary_color === "") cleanedUpdates.secondary_color = null;
      if (cleanedUpdates.accent_color === "") cleanedUpdates.accent_color = null;

      const { data, error } = await (supabase as any)
        .from("brands")
        .update(cleanedUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Brand;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
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
    mutationFn: async (data: AgreementCreate) => {
      // Validate input
      const validated = agreementCreateSchema.parse(data);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: agreement, error } = await (supabase as any)
        .from("partner_agreements")
        .insert({
          ...validated,
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
    mutationFn: async (data: ContactCreate) => {
      // Validate input
      const validated = contactCreateSchema.parse(data);
      
      // Clean empty strings to null
      const cleanedData = {
        ...validated,
        last_name: validated.last_name || null,
        designation: validated.designation || null,
        mobile_phone: validated.mobile_phone || null,
        notes: validated.notes || null,
      };

      const { data: contact, error } = await (supabase as any)
        .from("partner_contacts")
        .insert(cleanedData)
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
    mutationFn: async (data: AddressCreate) => {
      // Validate input
      const validated = addressCreateSchema.parse(data);
      
      // Clean empty strings to null
      const cleanedData = {
        ...validated,
        address_line2: validated.address_line2 || null,
        state: validated.state || null,
        contact_id: validated.contact_id || null,
        contact_name: validated.contact_name || null,
      };

      const { data: address, error } = await (supabase as any)
        .from("partner_addresses")
        .insert(cleanedData)
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
    mutationFn: async ({ id, updates }: { id: string; updates: AgreementUpdate }) => {
      // Validate input
      const validated = agreementUpdateSchema.parse(updates);
      
      const { data, error } = await (supabase as any)
        .from("partner_agreements")
        .update(validated)
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
    mutationFn: async ({ id, updates }: { id: string; updates: ContactUpdate }) => {
      // Validate input
      const validated = contactUpdateSchema.parse(updates);
      
      const { data, error } = await (supabase as any)
        .from("partner_contacts")
        .update(validated)
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
    mutationFn: async ({ id, updates }: { id: string; updates: AddressUpdate }) => {
      // Validate input
      const validated = addressUpdateSchema.parse(updates);
      
      const { data, error } = await (supabase as any)
        .from("partner_addresses")
        .update(validated)
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

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("brands")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Brand deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete brand: ${error.message}`);
    },
  });
};

export const useDeleteAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("partner_agreements")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Agreement deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete agreement: ${error.message}`);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("partner_contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Contact deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("partner_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Address deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete address: ${error.message}`);
    },
  });
};
