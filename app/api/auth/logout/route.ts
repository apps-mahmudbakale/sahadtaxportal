import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    console.log('🚪 Logout request received')
    const cookieStore = await cookies()
    
    // Check if cookie exists before clearing
    const existingCookie = cookieStore.get('admin_session')
    console.log('🍪 Existing cookie:', existingCookie ? 'exists' : 'not found')
    
    // Try multiple methods to clear the cookie
    try {
      // Method 1: Delete the cookie
      cookieStore.delete('admin_session')
      console.log('🗑️ Cookie deleted with delete()')
    } catch (deleteError) {
      console.log('❌ Delete method failed:', deleteError)
    }
    
    try {
      // Method 2: Set cookie to empty with past expiration
      cookieStore.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: -1, // Past expiration
        path: '/',
        expires: new Date(0) // Explicit past date
      })
      console.log('🗑️ Cookie cleared with set() method')
    } catch (setError) {
      console.log('❌ Set method failed:', setError)
    }

    console.log('✅ Session cookie clearing attempted')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}