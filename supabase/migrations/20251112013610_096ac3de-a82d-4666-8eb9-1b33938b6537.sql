-- Task 1.21a.1: Enhance partner_agreements table with payment model fields

-- Add payment model enum
CREATE TYPE payment_model AS ENUM ('royalty_profit', 'royalty_revenue', 'flat_fee', 'advance');

-- Add new columns to partner_agreements
ALTER TABLE partner_agreements
  ADD COLUMN payment_model payment_model DEFAULT NULL,
  ADD COLUMN flat_fee_amount numeric DEFAULT NULL,
  ADD COLUMN advance_amount numeric DEFAULT NULL,
  ADD COLUMN advance_balance numeric DEFAULT NULL,
  ADD COLUMN advance_recoupment_rate numeric DEFAULT NULL,
  ADD COLUMN marketing_attribution_cap_percent numeric DEFAULT NULL,
  ADD COLUMN calculation_basis text DEFAULT NULL;

-- Add check constraints for valid values
ALTER TABLE partner_agreements
  ADD CONSTRAINT payment_model_royalty_rate_check 
    CHECK (
      payment_model IS NULL OR 
      payment_model NOT IN ('royalty_profit', 'royalty_revenue') OR 
      royalty_rate IS NOT NULL
    ),
  ADD CONSTRAINT payment_model_flat_fee_check 
    CHECK (
      payment_model IS NULL OR 
      payment_model != 'flat_fee' OR 
      flat_fee_amount IS NOT NULL
    ),
  ADD CONSTRAINT payment_model_advance_check 
    CHECK (
      payment_model IS NULL OR 
      payment_model != 'advance' OR 
      (advance_amount IS NOT NULL AND advance_recoupment_rate IS NOT NULL)
    ),
  ADD CONSTRAINT marketing_cap_valid_range 
    CHECK (
      marketing_attribution_cap_percent IS NULL OR 
      (marketing_attribution_cap_percent >= 0 AND marketing_attribution_cap_percent <= 100)
    ),
  ADD CONSTRAINT royalty_rate_valid_range 
    CHECK (
      royalty_rate IS NULL OR 
      (royalty_rate >= 0 AND royalty_rate <= 100)
    ),
  ADD CONSTRAINT commission_rate_valid_range 
    CHECK (
      commission_rate IS NULL OR 
      (commission_rate >= 0 AND commission_rate <= 100)
    );

-- Add comment explaining the new structure
COMMENT ON COLUMN partner_agreements.payment_model IS 'Type of payment structure: royalty_profit (% of profit), royalty_revenue (% of revenue), flat_fee (fixed amount), or advance (upfront with recoupment)';
COMMENT ON COLUMN partner_agreements.marketing_attribution_cap_percent IS 'Maximum % of net revenue that can be deducted for marketing costs in profit calculations (e.g., 25.0 for 25%)';
COMMENT ON COLUMN partner_agreements.calculation_basis IS 'Description of what counts as revenue/profit for this agreement';
COMMENT ON COLUMN partner_agreements.advance_balance IS 'Remaining advance amount to be recouped from future payments';