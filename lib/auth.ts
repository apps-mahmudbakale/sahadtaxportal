import { cookies } from 'next/headers'

export interface AdminUser {
  id: string
  email: string
  name: string
}

export async function getServerSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return null
    }

    // Decode session token
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
    
    // Check if session is expired (7 days)
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - sessionData.loginTime > sevenDaysInMs) {
      return null
    }

    return {
      id: sessionData.userId,
      email: sessionData.email,
      name: sessionData.name
    }
  } catch (error) {
    return null
  }
}

export async function requireAuth(): Promise<AdminUser> {
  const user = await getServerSession()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}