-- Check the health_records table structure and data
SELECT 
  hr.id,
  hr.patient_id,
  hr.doctor_id,
  hr.report_type,
  hr.title,
  hr.file_name,
  hr.created_at,
  p.vh_id as patient_vh_id,
  p.name as patient_name,
  d.doc_id as doctor_doc_id,
  d.name as doctor_name
FROM health_records hr
LEFT JOIN patients p ON hr.patient_id = p.id
LEFT JOIN doctors d ON hr.doctor_id = d.id
ORDER BY hr.created_at DESC;