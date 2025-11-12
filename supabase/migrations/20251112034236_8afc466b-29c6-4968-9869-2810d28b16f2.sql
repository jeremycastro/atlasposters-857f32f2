-- Add contact fields to partner_addresses table
ALTER TABLE partner_addresses 
ADD COLUMN contact_id uuid REFERENCES partner_contacts(id) ON DELETE SET NULL,
ADD COLUMN contact_name text;

-- Add index for performance
CREATE INDEX idx_partner_addresses_contact_id ON partner_addresses(contact_id);