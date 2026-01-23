"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@sahadhospitals.com")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          cache: 'no-store',
          credentials: 'include'
        })
        const data = await response.json()
        
        if (data.user) {
          console.log("✅ Already logged in, redirecting to dashboard...")
          router.push("/admin/dashboard")
        }
      } catch (error) {
        console.log("No existing session")
      }
    }
    
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      if (data.success) {
        console.log("✅ Login successful, redirecting to dashboard...")
        router.push('/admin/dashboard')
      } else {
        setError('Login failed')
      }
    } catch (err) {
      setError('Network error - please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white text-slate-800 py-4 px-4 shadow-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="relative size-10 rounded-lg overflow-hidden bg-white p-1 border border-slate-200">
            <Image
              src="/sahad-logo.png"
              alt="Sahad Hospitals Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-800">Sahad Hospitals</h1>
            <p className="text-slate-600 text-sm">Admin Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-green-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 size-12 rounded-full bg-green-100 flex items-center justify-center">
              <Lock className="size-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-slate-800">Admin Login</CardTitle>
            <CardDescription className="text-slate-500">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@sahadhospitals.com"
                    value=""
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-slate-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value=""
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-slate-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="size-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <>
                    <Spinner className="size-4" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="size-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
               
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-slate-400">
        <p>Sahad Hospitals HR Department</p>
        <a 
          href="/" 
          className="text-green-600 hover:text-green-700 underline underline-offset-2"
        >
          Staff Portal
        </a>
      </footer>
    </div>
  )
}