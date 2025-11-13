-- Add index for faster thumbnail lookups
CREATE INDEX IF NOT EXISTS idx_artwork_files_type_variant 
ON artwork_files(artwork_id, file_type, ((metadata->>'variant')::text))
WHERE file_type = 'thumbnail';

-- Add metadata column comment for documentation
COMMENT ON COLUMN artwork_files.metadata IS 'Stores additional file metadata. For thumbnails: {"variant": "small"|"medium"|"large", "original_file_id": "uuid", "generated_at": "timestamp"}';