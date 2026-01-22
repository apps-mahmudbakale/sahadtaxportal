import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  console.log("🛡️ Proxy checking path:", req.nextUrl.pathname)

  // Check if the route is an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    console.log("🔍 Admin route detected:", req.nextUrl.pathname)
    
    // Skip auth check for the login page
    if (req.nextUrl.pathname === '/admin' || req.nextUrl.pathname === '/admin/login') {
      console.log("✅ Login page - allowing access")
      return NextResponse.next()
    }

    // Check authentication for other admin routes
    try {
      const sessionToken = req.cookies.get('admin_session')?.value
      
      if (!sessionToken) {
        console.log("❌ No session token - redirecting to login")
        return NextResponse.redirect(new URL('/admin', req.url))
      }

      // Decode and validate session token
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
      
      // Check if session is expired (7 days)
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - sessionData.loginTime > sevenDaysInMs) {
        console.log("❌ Session expired - redirecting to login")
        const response = NextResponse.redirect(new URL('/admin', req.url))
        response.cookies.delete('admin_session')
        return response
      }

      console.log("✅ Valid session - allowing access to:", req.nextUrl.pathname)
      return NextResponse.next()
      
    } catch (error) {
      console.error("💥 Session validation error:", error)
      const response = NextResponse.redirect(new URL('/admin', req.url))
      response.cookies.delete('admin_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}