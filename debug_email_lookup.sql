-- Check what emails exist in the patients table
SELECT id, vh_id, name, email, auth_user_id FROM patients;

-- Check what emails exist in the doctors table  
SELECT id, doc_id, name, email, auth_user_id FROM doctors;