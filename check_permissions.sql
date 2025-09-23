-- Check RLS policies for patients table
SELECT * FROM pg_policies WHERE tablename = 'patients';

-- Test if doctors can see patients (run this while logged in as a doctor)
SELECT id, vh_id, name FROM patients LIMIT 5;