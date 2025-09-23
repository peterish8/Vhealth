-- Check what text was extracted from uploaded PDFs
SELECT 
  title,
  file_name,
  extracted_text,
  created_at
FROM health_records 
WHERE file_name IS NOT NULL
ORDER BY created_at DESC 
LIMIT 3;