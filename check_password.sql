-- Check the password stored for VH-2025-0002
SELECT vh_id, name, password_hash FROM patients WHERE vh_id = 'VH-2025-0002';