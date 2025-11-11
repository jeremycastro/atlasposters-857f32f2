-- Allow all MIME types for brand-assets bucket to support documents and all image formats
UPDATE storage.buckets
SET allowed_mime_types = NULL
WHERE id = 'brand-assets';