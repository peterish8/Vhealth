-- First, you need to manually create these users in Supabase Auth Dashboard
-- Go to Authentication > Users > Add User

-- Test Doctor Credentials:
-- Email: sarah.johnson@vhealth.com, Password: doctor123
-- Email: michael.chen@vhealth.com, Password: doctor123
-- Email: priya.sharma@vhealth.com, Password: doctor123

-- After creating auth users, get their UUIDs and update the doctors table:
-- UPDATE doctors SET auth_user_id = 'USER_UUID_HERE' WHERE doc_id = 'DOC-2025-0001';
-- UPDATE doctors SET auth_user_id = 'USER_UUID_HERE' WHERE doc_id = 'DOC-2025-0002';
-- UPDATE doctors SET auth_user_id = 'USER_UUID_HERE' WHERE doc_id = 'DOC-2025-0003';