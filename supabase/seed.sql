-- Insert static staff records
INSERT INTO staff (staff_id, name, department, national_tin, fct_irs_tax_id, status, has_submitted, submitted_at) VALUES
  ('SH001', 'Dr. Amina Ibrahim', 'Cardiology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH002', 'Nurse Chidi Okonkwo', 'Emergency Medicine', 'TIN12345678', 'FCT87654321', 'pending', TRUE, '2026-01-20T14:30:00Z'),
  ('SH003', 'Dr. Fatima Yusuf', 'Pediatrics', NULL, NULL, 'pending', FALSE, NULL),
  ('SH004', 'Mr. Kemi Adebayo', 'Laboratory', NULL, NULL, 'pending', FALSE, NULL),
  ('SH005', 'Dr. Ahmed Musa', 'Surgery', NULL, NULL, 'pending', FALSE, NULL),
  ('SH006', 'Nurse Blessing Okoro', 'ICU', NULL, NULL, 'pending', FALSE, NULL),
  ('SH007', 'Dr. Sarah Johnson', 'Radiology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH008', 'Dr. Halima Musa', 'Pediatrics', 'TIN11223344', 'FCT44332211', 'approved', TRUE, '2026-01-17T09:00:00Z'),
  ('SH009', 'Mr. David Okafor', 'Pharmacy', NULL, NULL, 'pending', FALSE, NULL),
  ('SH010', 'Nurse Mary Eze', 'Maternity', NULL, NULL, 'pending', FALSE, NULL),
  ('SH011', 'Dr. Ibrahim Garba', 'Orthopedics', NULL, NULL, 'pending', FALSE, NULL),
  ('SH012', 'Ms. Grace Adamu', 'Administration', NULL, NULL, 'pending', FALSE, NULL),
  ('SH013', 'Dr. Funmi Oladele', 'Dermatology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH014', 'Mr. John Emeka', 'Security', NULL, NULL, 'pending', FALSE, NULL),
  ('SH015', 'Dr. Aisha Bello', 'Orthopedics', 'TIN98765432', 'FCT12345678', 'approved', TRUE, '2026-01-19T10:15:00Z'),
  ('SH016', 'Nurse Patience Uche', 'Outpatient', NULL, NULL, 'pending', FALSE, NULL),
  ('SH017', 'Dr. Yusuf Abdullahi', 'Neurology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH018', 'Ms. Esther Okon', 'Human Resources', NULL, NULL, 'pending', FALSE, NULL),
  ('SH019', 'Mr. Peter Nwankwo', 'Maintenance', NULL, NULL, 'pending', FALSE, NULL),
  ('SH020', 'Dr. Zainab Aliyu', 'Psychiatry', NULL, NULL, 'pending', FALSE, NULL),
  ('SH021', 'Nurse Joseph Adeyemi', 'Emergency Medicine', NULL, NULL, 'pending', FALSE, NULL),
  ('SH022', 'Dr. Olumide Fashola', 'Gastroenterology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH023', 'Mr. Emmanuel Adeyemi', 'Radiology', 'TIN55667788', 'FCT99887766', 'pending', TRUE, '2026-01-18T16:45:00Z'),
  ('SH024', 'Nurse Rebecca Ojo', 'Pediatrics', NULL, NULL, 'pending', FALSE, NULL),
  ('SH025', 'Dr. Maryam Suleiman', 'Ophthalmology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH026', 'Mr. Anthony Okwu', 'IT Department', NULL, NULL, 'pending', FALSE, NULL),
  ('SH027', 'Nurse Comfort Bassey', 'Surgery', NULL, NULL, 'pending', FALSE, NULL),
  ('SH028', 'Dr. Rasheed Lawal', 'Urology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH029', 'Ms. Victoria Nkem', 'Finance', NULL, NULL, 'pending', FALSE, NULL),
  ('SH030', 'Dr. Hauwa Baba', 'Endocrinology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH031', 'Nurse Grace Eze', 'Cardiology', 'TIN77889900', '', 'rejected', TRUE, '2026-01-16T11:30:00Z'),
  ('SH032', 'Dr. Chinedu Obi', 'Oncology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH033', 'Mr. Samuel Adamu', 'Housekeeping', NULL, NULL, 'pending', FALSE, NULL),
  ('SH034', 'Nurse Folake Adebisi', 'Dialysis Unit', NULL, NULL, 'pending', FALSE, NULL),
  ('SH035', 'Dr. Nasir Mohammed', 'Pulmonology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH036', 'Ms. Jennifer Okoro', 'Medical Records', NULL, NULL, 'pending', FALSE, NULL),
  ('SH037', 'Dr. Adaora Nwosu', 'Rheumatology', NULL, NULL, 'pending', FALSE, NULL),
  ('SH038', 'Mr. Godwin Ibe', 'Transport', NULL, NULL, 'pending', FALSE, NULL),
  ('SH039', 'Nurse Hadiza Yusuf', 'Intensive Care', NULL, NULL, 'pending', FALSE, NULL),
  ('SH040', 'Dr. Tunde Akinola', 'Anesthesiology', NULL, NULL, 'pending', FALSE, NULL);

-- Insert admin user with hashed password
-- Password: 'admin123' hashed using bcrypt
INSERT INTO admin_users (email, password_hash, name, is_active) VALUES
  ('admin@sahadhospitals.com', '$2b$10$pnjhEJJblDusRBhMDRJmhOXCoJZpmUKlbFeoHQTyH8/tuyjAVEiaS', 'System Administrator', TRUE);

-- Update some records to have reviewed_at timestamps for approved/rejected records
UPDATE staff SET reviewed_at = '2026-01-17T10:00:00Z' WHERE staff_id = 'SH008';
UPDATE staff SET reviewed_at = '2026-01-19T11:00:00Z' WHERE staff_id = 'SH015';
UPDATE staff SET reviewed_at = '2026-01-16T12:00:00Z' WHERE staff_id = 'SH031';