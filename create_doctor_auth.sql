-- Create auth users for existing doctors
-- Run this in Supabase SQL Editor after manually creating these users in Auth:

-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" and create these accounts:

-- Email: sarah.johnson@vhealth.com, Password: doctor123
-- Email: michael.chen@vhealth.com, Password: doctor123  
-- Email: priya.sharma@vhealth.com, Password: doctor123

-- 3. After creating, get their UUIDs and run:
-- UPDATE doctors SET auth_user_id = 'UUID_HERE' WHERE doc_id = 'DOC-2025-0001';
-- UPDATE doctors SET auth_user_id = 'UUID_HERE' WHERE doc_id = 'DOC-2025-0002';
-- UPDATE doctors SET auth_user_id = 'UUID_HERE' WHERE doc_id = 'DOC-2025-0003';