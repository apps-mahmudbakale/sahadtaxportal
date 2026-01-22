-- Simple script to create admin user for table-based authentication
-- Run this in your Supabase SQL Editor after running schema.sql

-- Insert admin user with hashed password (admin123)
INSERT INTO admin_users (email, password_hash, name, is_active) VALUES
  ('admin@sahadhospitals.com', '$2b$10$pnjhEJJblDusRBhMDRJmhOXCoJZpmUKlbFeoHQTyH8/tuyjAVEiaS', 'System Administrator', TRUE)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active;

-- Verify the admin user was created
SELECT id, email, name, is_active, created_at 
FROM admin_users 
WHERE email = 'admin@sahadhospitals.com';