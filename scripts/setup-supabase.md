# Supabase Setup Instructions (Table-Based Authentication)

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings
3. **Important**: Also get your service role key (needed for admin operations)

## 2. Set Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.local.example and fill in your values
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3. Run Database Schema

In your Supabase project dashboard:

1. Go to the SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the query to create the tables and policies
4. This creates both `staff` and `admin_users` tables

## 4. Seed the Database

1. In the SQL Editor, copy and paste the contents of `supabase/seed.sql`
2. Run the query to insert the sample staff records and admin user

## 5. Verify Admin User Creation

1. In the SQL Editor, run: `SELECT * FROM admin_users;`
2. You should see the admin user with email `admin@sahadhospitals.com`
3. If not, run the contents of `scripts/create-admin-simple.sql`

## 6. Test the Application

1. Start your development server: `yarn dev`
2. Visit the staff portal at `http://localhost:3000`
3. Try searching with staff IDs: SH001, SH002, SH003, etc.
4. Visit the admin portal at `http://localhost:3000/admin`
5. **Login with**: `admin@sahadhospitals.com` / `admin123`
6. View and manage submitted tax ID records

## Login Credentials

- **Email**: `admin@sahadhospitals.com`
- **Password**: `admin123`

## Available Test Staff IDs

- **SH001**: Dr. Amina Ibrahim (Cardiology) - New record
- **SH002**: Nurse Chidi Okonkwo (Emergency Medicine) - Already submitted
- **SH003**: Dr. Fatima Yusuf (Pediatrics) - New record
- **SH004-SH040**: Various staff members - All new records

## Features

### Staff Portal
- Search by Staff ID
- Submit tax ID information (National TIN and FCT-IRS Tax ID)
- Alphanumeric validation
- Prevents duplicate submissions

### Admin Portal
- **Table-based authentication** (no Supabase Auth complexity)
- View all submitted records
- Filter by status (pending, approved, rejected)
- Search by name, staff ID, or department
- Approve/reject submissions
- Export to CSV
- Real-time updates
- Secure logout

## Security Features

- **Simple table-based authentication** instead of Supabase Auth
- Bcrypt password hashing
- HTTP-only session cookies
- Row Level Security (RLS) enabled
- Service role access for admin operations
- Protected admin routes with Next.js 16 proxy
- Session expiration (7 days)

## Technical Architecture

### Authentication Flow
1. User submits login form
2. API validates credentials against `admin_users` table
3. Creates secure session token (Base64 encoded JSON)
4. Sets HTTP-only cookie with session token
5. Proxy validates session on protected routes

### Database Tables
- **staff**: Staff records and tax ID submissions
- **admin_users**: Admin login credentials (bcrypt hashed passwords)

### API Routes
- `POST /api/auth/login` - Authenticate admin user
- `POST /api/auth/logout` - Clear session cookie
- `GET /api/auth/session` - Check current session

## Troubleshooting

### Login Issues
1. **"Invalid email or password"**: Check if admin user exists in `admin_users` table
2. **"Internal server error"**: Check service role key in environment variables
3. **Stuck on login page**: Check browser console for errors

### Database Issues
1. **Table doesn't exist**: Run `supabase/schema.sql` first
2. **No admin user**: Run `scripts/create-admin-simple.sql`
3. **Permission denied**: Ensure service role key is correct

### Quick Fixes
- **Reset admin password**: Update `password_hash` in `admin_users` table
- **Clear session**: Delete `admin_session` cookie in browser
- **Check logs**: Look at browser console and server logs for errors