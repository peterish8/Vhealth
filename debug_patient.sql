-- Check if patients table exists and has data
SELECT * FROM patients WHERE vh_id = 'VH-2025-0001';

-- If no results, insert test patient
INSERT INTO patients (vh_id, name, email, password_hash) 
VALUES ('VH-2025-0001', 'Test Patient', 'patient@test.com', 'password123')
ON CONFLICT (vh_id) DO NOTHING;