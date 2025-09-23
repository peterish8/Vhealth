-- Delete all patients and their health records
DELETE FROM health_records WHERE patient_id IN (SELECT id FROM patients);
DELETE FROM patients;