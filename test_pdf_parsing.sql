-- Check what file data we have for uploaded reports
SELECT 
  title,
  report_type,
  file_name,
  file_url,
  clinical_notes,
  created_at
FROM health_records 
ORDER BY created_at DESC 
LIMIT 5;