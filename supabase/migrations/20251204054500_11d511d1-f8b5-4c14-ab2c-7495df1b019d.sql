-- Make partner_id nullable in partner_products
ALTER TABLE partner_products ALTER COLUMN partner_id DROP NOT NULL;