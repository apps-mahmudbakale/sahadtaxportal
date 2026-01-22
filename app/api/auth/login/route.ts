import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

// Use service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login API called')
    
    const { email, password } = await request.json()
    console.log('📧 Login attempt for:', email)

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('🌐 Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('❌ Missing environment variables')
      return NextResponse.json(
        { error: 'Server configuration error - missing environment variables' },
        { status: 500 }
      )
    }

    // Create admin client
    console.log('🔧 Creating Supabase admin client...')
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Query admin user from database using service role
    console.log('🔍 Querying admin_users table...')
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, password_hash, name, is_active')
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)
      .single()

    console.log('📊 Database query result:', {
      found: !!adminUser,
      error: error?.message,
      errorCode: error?.code
    })

    if (error) {
      console.log('❌ Database error details:', error)
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    if (!adminUser) {
      console.log('❌ Admin user not found')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('👤 Admin user found:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      hasPasswordHash: !!adminUser.password_hash
    })

    // Verify password
    console.log('🔒 Verifying password...')
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash)
    console.log('🔒 Password valid:', isValidPassword)

    if (!isValidPassword) {
      console.log('❌ Invalid password')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session token (simple JWT-like token)
    console.log('🎫 Creating session token...')
    const sessionToken = Buffer.from(JSON.stringify({
      userId: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      loginTime: Date.now()
    })).toString('base64')

    // Set session cookie
    console.log('🍪 Setting session cookie...')
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    console.log('✅ Login successful!')
    return NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name
      }
    })

  } catch (error) {
    console.error('💥 Login API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}