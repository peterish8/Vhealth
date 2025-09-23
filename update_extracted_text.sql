-- Update the prescription PDF with sample extracted text for testing
UPDATE health_records 
SET extracted_text = 'PRESCRIPTION - Patient: Prathick Dhanes R - Diagnosis: Rare Chronic Disease - Medications: Metformin 500mg twice daily, Lisinopril 10mg once daily, Specialized medication for rare condition - Instructions: Take with food, monitor blood pressure regularly - Follow up in 2 weeks'
WHERE file_name = 'prescription_prathick_patient.pdf';