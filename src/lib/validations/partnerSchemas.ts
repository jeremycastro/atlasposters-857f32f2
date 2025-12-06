import { z } from "zod";

// Partner validation schemas
export const partnerCreateSchema = z.object({
  partner_name: z.string().trim().min(1, "Partner name is required").max(200, "Partner name must be less than 200 characters"),
  website_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  status: z.enum(["pending", "active", "inactive", "suspended"]).default("pending"),
  atlas_manager_id: z.string().uuid("Invalid manager ID").optional().or(z.literal("")),
  notes: z.string().max(5000, "Notes must be less than 5000 characters").optional(),
});

export const partnerUpdateSchema = partnerCreateSchema.partial();

// Brand validation schemas
export const brandCreateSchema = z.object({
  partner_id: z.string().uuid("Invalid partner ID"),
  brand_name: z.string().trim().min(1, "Brand name is required").max(200, "Brand name must be less than 200 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  tagline: z.string().max(200, "Tagline must be less than 200 characters").optional(),
  website_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  logo_url: z.string().url("Invalid URL format").optional().or(z.literal("")).nullable(),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional().or(z.literal("")),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional().or(z.literal("")),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional().or(z.literal("")),
});

export const brandUpdateSchema = brandCreateSchema.partial();

// Contact validation schemas
export const contactCreateSchema = z.object({
  partner_id: z.string().uuid("Invalid partner ID"),
  first_name: z.string().trim().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  last_name: z.string().max(100, "Last name must be less than 100 characters").optional(),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  designation: z.string().max(100, "Designation must be less than 100 characters").optional(),
  country_code: z.string().max(10, "Country code must be less than 10 characters").optional(),
  mobile_phone: z.string().max(20, "Phone number must be less than 20 characters").optional(),
  is_primary: z.boolean().optional(),
  notes: z.string().max(2000, "Notes must be less than 2000 characters").optional(),
});

export const contactUpdateSchema = contactCreateSchema.partial();

// Address validation schemas
export const addressCreateSchema = z.object({
  partner_id: z.string().uuid("Invalid partner ID"),
  designation: z.string().min(1, "Address type is required").max(50, "Address type must be less than 50 characters"),
  address_line1: z.string().trim().min(1, "Address line 1 is required").max(200, "Address must be less than 200 characters"),
  address_line2: z.string().max(200, "Address must be less than 200 characters").optional(),
  city: z.string().trim().min(1, "City is required").max(100, "City must be less than 100 characters"),
  state: z.string().max(100, "State must be less than 100 characters").optional(),
  postal_code: z.string().trim().min(1, "Postal code is required").max(20, "Postal code must be less than 20 characters"),
  country: z.string().min(1, "Country is required").max(100, "Country must be less than 100 characters"),
  is_primary: z.boolean().optional(),
  contact_id: z.string().uuid("Invalid contact ID").optional().or(z.literal("")),
  contact_name: z.string().max(200, "Contact name must be less than 200 characters").optional(),
});

export const addressUpdateSchema = addressCreateSchema.partial();

// Agreement validation schemas  
export const agreementCreateSchema = z.object({
  partner_id: z.string().uuid("Invalid partner ID"),
  agreement_type: z.string().min(1, "Agreement type is required").max(100),
  effective_date: z.string().min(1, "Effective date is required"),
  expiration_date: z.string().optional(),
  status: z.enum(["draft", "active", "expired", "terminated"]).optional(),
  payment_model: z.enum(["royalty", "commission", "flat_fee", "hybrid"]).optional().nullable(),
  royalty_rate: z.number().min(0).max(100).optional().nullable(),
  commission_rate: z.number().min(0).max(100).optional().nullable(),
  flat_fee_amount: z.number().min(0).optional().nullable(),
  minimum_guarantee: z.number().min(0).optional().nullable(),
  advance_amount: z.number().min(0).optional().nullable(),
  payment_period: z.string().max(50).optional(),
  calculation_basis: z.string().max(100).optional(),
  terms: z.record(z.unknown()).optional(),
  revenue_definition: z.record(z.unknown()).optional(),
  royalty_groups: z.record(z.unknown()).optional(),
});

export const agreementUpdateSchema = agreementCreateSchema.partial();

// Type exports
export type PartnerCreate = z.infer<typeof partnerCreateSchema>;
export type PartnerUpdate = z.infer<typeof partnerUpdateSchema>;
export type BrandCreate = z.infer<typeof brandCreateSchema>;
export type BrandUpdate = z.infer<typeof brandUpdateSchema>;
export type ContactCreate = z.infer<typeof contactCreateSchema>;
export type ContactUpdate = z.infer<typeof contactUpdateSchema>;
export type AddressCreate = z.infer<typeof addressCreateSchema>;
export type AddressUpdate = z.infer<typeof addressUpdateSchema>;
export type AgreementCreate = z.infer<typeof agreementCreateSchema>;
export type AgreementUpdate = z.infer<typeof agreementUpdateSchema>;
