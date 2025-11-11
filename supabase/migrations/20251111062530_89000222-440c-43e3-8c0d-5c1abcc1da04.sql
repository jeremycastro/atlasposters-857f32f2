-- Create partners table
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  website_url TEXT,
  status TEXT DEFAULT 'pending',
  atlas_manager_id UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  CONSTRAINT partners_status_check CHECK (status IN ('pending', 'active', 'inactive', 'suspended'))
);

-- Create brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create partner_agreements table
CREATE TABLE public.partner_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  agreement_type TEXT NOT NULL,
  agreement_document_path TEXT,
  effective_date DATE NOT NULL,
  expiration_date DATE,
  royalty_rate NUMERIC(5,2),
  commission_rate NUMERIC(5,2),
  payment_period TEXT,
  terms JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  CONSTRAINT partner_agreements_type_check CHECK (agreement_type IN ('royalty', 'wholesale', 'commission', 'licensing')),
  CONSTRAINT partner_agreements_period_check CHECK (payment_period IN ('monthly', 'quarterly', 'annually', 'per_transaction')),
  CONSTRAINT partner_agreements_status_check CHECK (status IN ('draft', 'active', 'expired', 'terminated'))
);

-- Create partner_contacts table
CREATE TABLE public.partner_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  designation TEXT,
  user_id UUID REFERENCES public.profiles(id),
  notes TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT partner_contacts_designation_check CHECK (designation IN ('point_of_contact', 'marketing', 'legal', 'graphic_designer', 'finance', 'other'))
);

-- Create partner_addresses table
CREATE TABLE public.partner_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  designation TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT partner_addresses_designation_check CHECK (designation IN ('ship_to', 'bill_to', 'headquarters', 'warehouse', 'other'))
);

-- Create partner_assets table
CREATE TABLE public.partner_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES public.profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT partner_assets_type_check CHECK (asset_type IN ('logo', 'brand_guide', 'contract', 'other'))
);

-- Add brand_id to artworks table
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_assets ENABLE ROW LEVEL SECURITY;

-- Triggers
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  
CREATE TRIGGER update_partner_agreements_updated_at BEFORE UPDATE ON public.partner_agreements 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  
CREATE TRIGGER update_partner_contacts_updated_at BEFORE UPDATE ON public.partner_contacts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  
CREATE TRIGGER update_partner_addresses_updated_at BEFORE UPDATE ON public.partner_addresses 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();