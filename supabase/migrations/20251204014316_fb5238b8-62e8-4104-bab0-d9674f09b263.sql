-- Add revenue_definition JSONB column to partner_agreements table
ALTER TABLE public.partner_agreements
ADD COLUMN revenue_definition JSONB DEFAULT NULL;

-- Add a comment describing the expected structure
COMMENT ON COLUMN public.partner_agreements.revenue_definition IS 'Revenue calculation settings: { exclude_shipping: boolean, exclude_taxes_vat: boolean, deduct_discounts: boolean, deduct_returns: boolean }';