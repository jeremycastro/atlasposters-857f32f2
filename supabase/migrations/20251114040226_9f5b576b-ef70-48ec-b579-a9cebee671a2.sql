
-- Fix: Update full_sku length constraint to support 20-character SKUs
ALTER TABLE product_variants
DROP CONSTRAINT IF EXISTS product_variants_full_sku_check;

ALTER TABLE product_variants
ADD CONSTRAINT product_variants_full_sku_check
CHECK (length(full_sku) <= 20 AND length(full_sku) >= 10);
