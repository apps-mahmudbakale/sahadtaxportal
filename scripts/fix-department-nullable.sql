-- Fix department column to allow NULL values
-- This script ensures the department column can accept NULL values

-- Drop the NOT NULL constraint if it exists
ALTER TABLE staff ALTER COLUMN department DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'staff' AND column_name = 'department';