-- Add new payment model fields to partner_agreements for tiered royalty support
-- This supports the hybrid model with: initiation fee, minimum guarantee, and tiered royalty groups

-- First, add the new enum value for tiered royalty payment model
ALTER TYPE payment_model ADD VALUE IF NOT EXISTS 'tiered_royalty';

-- Add new columns for the comprehensive payment model
ALTER TABLE partner_agreements
ADD COLUMN IF NOT EXISTS initiation_fee numeric,
ADD COLUMN IF NOT EXISTS initiation_fee_due_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS initiation_fee_paid_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS minimum_guarantee numeric,
ADD COLUMN IF NOT EXISTS minimum_guarantee_start_month integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS royalty_groups jsonb DEFAULT '[]'::jsonb;

-- Add comments to document the structure
COMMENT ON COLUMN partner_agreements.initiation_fee IS 'One-time registration/initiation fee amount';
COMMENT ON COLUMN partner_agreements.initiation_fee_due_days IS 'Number of days after contract signing when fee is due';
COMMENT ON COLUMN partner_agreements.initiation_fee_paid_at IS 'Timestamp when initiation fee was paid';
COMMENT ON COLUMN partner_agreements.minimum_guarantee IS 'Minimum monthly payment guarantee amount';
COMMENT ON COLUMN partner_agreements.minimum_guarantee_start_month IS 'Month number when minimum guarantee begins (e.g., 3 for Month 3)';
COMMENT ON COLUMN partner_agreements.royalty_groups IS 'JSON array of royalty groups: [{name, rate, calculation_basis, applies_to, product_type_ids, product_ids}]';

-- Example royalty_groups structure:
-- [
--   { 
--     "name": "Framed Products", 
--     "rate": 10, 
--     "calculation_basis": "revenue",
--     "applies_to": "specific", 
--     "product_type_ids": ["uuid1"],
--     "product_ids": []
--   },
--   { 
--     "name": "All Other Products", 
--     "rate": 15, 
--     "calculation_basis": "revenue",
--     "applies_to": "all_other"
--   }
-- ]