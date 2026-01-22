import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('🔍 Debug: Checking environment variables...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      hasServiceKey: !!supabaseServiceKey,
      url: supabaseUrl?.substring(0, 20) + '...'
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey
        }
      }, { status: 500 })
    }

    // Test connection with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🔍 Debug: Testing database connection...')

    // Test basic connection by trying to access staff table
    const { data: staffTest, error: staffError } = await supabaseAdmin
      .from('staff')
      .select('count')
      .limit(1)

    console.log('Staff table test:', { staffTest, staffError })

    let staffTableExists = !staffError
    let adminUsersTableExists = false
    let adminUserExists = false
    let adminUserData = null

    // Test admin_users table
    const { data: adminTest, error: adminTableError } = await supabaseAdmin
      .from('admin_users')
      .select('count')
      .limit(1)

    console.log('Admin users table test:', { adminTest, adminTableError })

    if (!adminTableError) {
      adminUsersTableExists = true
      
      // Check for specific admin user
      const { data: adminUsers, error: adminUserError } = await supabaseAdmin
        .from('admin_users')
        .select('id, email, name, is_active, created_at')
        .eq('email', 'admin@sahadhospitals.com')

      console.log('Admin user check:', { adminUsers, adminUserError })
      
      if (!adminUserError && adminUsers && adminUsers.length > 0) {
        adminUserExists = true
        adminUserData = adminUsers[0]
      }
    }

    // Determine setup status and recommendations
    let setupStatus = 'unknown'
    let recommendations = []

    if (!staffTableExists) {
      setupStatus = 'no_tables'
      recommendations = [
        '❌ Database tables not found',
        '🔧 Run supabase/schema.sql in Supabase SQL Editor',
        '📝 Then run supabase/seed.sql to create admin user'
      ]
    } else if (!adminUsersTableExists) {
      setupStatus = 'missing_admin_table'
      recommendations = [
        '⚠️ Staff table exists but admin_users table missing',
        '🔧 Run supabase/schema.sql to create admin_users table',
        '📝 Then run supabase/seed.sql to create admin user'
      ]
    } else if (!adminUserExists) {
      setupStatus = 'missing_admin_user'
      recommendations = [
        '⚠️ Tables exist but no admin user found',
        '📝 Run supabase/seed.sql to create admin user',
        '🔧 Or run scripts/create-admin-simple.sql'
      ]
    } else {
      setupStatus = 'ready'
      recommendations = [
        '✅ Setup complete!',
        '🔐 Login with: admin@sahadhospitals.com / admin123',
        '🌐 Visit: /admin to login'
      ]
    }

    return NextResponse.json({
      success: true,
      setupStatus,
      environment: {
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        hasServiceKey: !!supabaseServiceKey,
        nodeEnv: process.env.NODE_ENV
      },
      database: {
        staffTableExists,
        adminUsersTableExists,
        adminUserExists,
        adminUserData
      },
      recommendations,
      nextSteps: setupStatus === 'ready' 
        ? ['Try logging in at /admin']
        : ['Follow the recommendations above', 'Then refresh this page to check again']
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      recommendations: [
        '❌ Database connection failed',
        '🔧 Check your Supabase URL and service role key',
        '📝 Verify your .env.local file has correct credentials'
      ]
    }, { status: 500 })
  }
}