-- Update brand-assets bucket to allow 100MB files
UPDATE storage.buckets
SET file_size_limit = 104857600  -- 100MB in bytes
WHERE id = 'brand-assets';