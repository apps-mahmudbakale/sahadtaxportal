import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    console.log('🔍 Session check - Cookie exists:', !!sessionToken)

    if (!sessionToken) {
      console.log('❌ No session token found')
      return NextResponse.json({ user: null })
    }

    // Decode session token
    try {
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
      
      // Check if session is expired (7 days)
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
      const isExpired = Date.now() - sessionData.loginTime > sevenDaysInMs
      
      console.log('🕐 Session age check - Expired:', isExpired)
      
      if (isExpired) {
        // Session expired, clear cookie
        console.log('⏰ Session expired, clearing cookie')
        cookieStore.delete('admin_session')
        return NextResponse.json({ user: null })
      }

      console.log('✅ Valid session found for user:', sessionData.email)
      return NextResponse.json({
        user: {
          id: sessionData.userId,
          email: sessionData.email,
          name: sessionData.name
        }
      })
    } catch (decodeError) {
      // Invalid session token, clear cookie
      console.log('❌ Invalid session token, clearing cookie')
      cookieStore.delete('admin_session')
      return NextResponse.json({ user: null })
    }

  } catch (error) {
    console.error('❌ Session check error:', error)
    return NextResponse.json({ user: null })
  }
}