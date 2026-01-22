-- Create the staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  national_tin VARCHAR(50),
  fct_irs_tax_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  has_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table for simple authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on staff_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_staff_id ON staff(staff_id);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- Create an index on has_submitted for filtering
CREATE INDEX IF NOT EXISTS idx_staff_has_submitted ON staff(has_submitted);

-- Create an index on admin email for faster login lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (staff can read their own records and update tax info)
CREATE POLICY "Staff can view their own record" ON staff
  FOR SELECT USING (true);

CREATE POLICY "Staff can update their tax information" ON staff
  FOR UPDATE USING (true);

-- Create policies for admin users table (only allow service role access)
CREATE POLICY "Service role can access admin users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for staff
CREATE TRIGGER update_staff_updated_at 
  BEFORE UPDATE ON staff 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically update updated_at for admin_users
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();