-- This script helps create an admin user directly in Supabase
-- Run this in your Supabase SQL Editor after running schema.sql

-- First, let's check if the auth schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth';

-- Insert a user directly into auth.users (bypass email confirmation)
-- Replace the email and encrypted password as needed
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@sahadhospitals.com',
  crypt('12345678', gen_salt('bf')), -- This encrypts the password '12345678'
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Verify the user was created
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'admin@sahadhospitals.com';