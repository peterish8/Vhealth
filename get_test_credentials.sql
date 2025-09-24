-- Get test patient credentials
SELECT vh_id, name, email, password_hash 
FROM patients 
WHERE vh_id IN ('VH-2025-0001');

-- From the test data, here are some known credentials:
-- Patient: vh_id: VH-2025-0001
-- Name: Test Patient
-- Email: patient@test.com
-- Password: password123