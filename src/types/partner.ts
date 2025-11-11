// Temporary types until Supabase types regenerate
export interface Partner {
  id: string;
  partner_name: string;
  website_url?: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  atlas_manager_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  atlas_manager?: {
    id: string;
    full_name?: string;
    email: string;
    avatar_url?: string;
  };
  brands?: Brand[];
  partner_contacts?: PartnerContact[];
  partner_addresses?: PartnerAddress[];
  partner_agreements?: PartnerAgreement[];
  partner_assets?: PartnerAsset[];
}

export interface Brand {
  id: string;
  partner_id: string;
  brand_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  partner?: {
    id: string;
    partner_name: string;
  };
  artworks?: Array<{
    id: string;
    title: string;
    asc_code: string;
    status: string;
  }>;
}

export interface PartnerAgreement {
  id: string;
  partner_id: string;
  agreement_type: 'royalty' | 'wholesale' | 'commission' | 'licensing';
  agreement_document_path?: string;
  effective_date: string;
  expiration_date?: string;
  royalty_rate?: number;
  commission_rate?: number;
  payment_period?: 'monthly' | 'quarterly' | 'annually' | 'per_transaction';
  terms?: any;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface PartnerContact {
  id: string;
  partner_id: string;
  full_name: string;
  email: string;
  phone?: string;
  designation: 'point_of_contact' | 'marketing' | 'legal' | 'graphic_designer' | 'finance' | 'other';
  user_id?: string;
  notes?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerAddress {
  id: string;
  partner_id: string;
  designation: 'ship_to' | 'bill_to' | 'headquarters' | 'warehouse' | 'other';
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerAsset {
  id: string;
  partner_id: string;
  brand_id?: string;
  asset_type: 'logo' | 'brand_guide' | 'contract' | 'other';
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: string;
  uploaded_at: string;
}
