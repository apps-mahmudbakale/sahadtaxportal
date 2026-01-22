"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react"

interface SetupStatus {
  success: boolean
  setupStatus: string
  environment: any
  database: any
  recommendations: string[]
  nextSteps: string[]
  error?: string
  details?: string
}

export default function SetupCheckPage() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkSetup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        success: false,
        setupStatus: 'error',
        environment: {},
        database: {},
        recommendations: ['❌ Failed to connect to API'],
        nextSteps: ['Check if development server is running'],
        error: 'Network error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSetup()
  }, [])

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="size-6 text-blue-600 animate-spin" />
    if (!status) return <XCircle className="size-6 text-red-600" />
    
    switch (status.setupStatus) {
      case 'ready':
        return <CheckCircle2 className="size-6 text-green-600" />
      case 'no_tables':
      case 'missing_admin_table':
      case 'missing_admin_user':
        return <AlertCircle className="size-6 text-amber-600" />
      default:
        return <XCircle className="size-6 text-red-600" />
    }
  }

  const getStatusColor = () => {
    if (loading) return 'border-blue-200 bg-blue-50'
    if (!status || status.error) return 'border-red-200 bg-red-50'
    
    switch (status.setupStatus) {
      case 'ready':
        return 'border-green-200 bg-green-50'
      case 'no_tables':
      case 'missing_admin_table':
      case 'missing_admin_user':
        return 'border-amber-200 bg-amber-50'
      default:
        return 'border-red-200 bg-red-50'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Setup Status Check</h1>
          <p className="text-slate-600">Verify your Supabase database and authentication setup</p>
        </div>

        <Card className={`${getStatusColor()}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getStatusIcon()}
              <span>
                {loading ? 'Checking Setup...' : 
                 status?.setupStatus === 'ready' ? 'Setup Complete!' :
                 status?.error ? 'Setup Error' : 'Setup Required'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Environment Variables</h3>
                    <div className="space-y-1 text-sm">
                      <p>Supabase URL: {status.environment.hasUrl ? '✅' : '❌'}</p>
                      <p>Anon Key: {status.environment.hasAnonKey ? '✅' : '❌'}</p>
                      <p>Service Key: {status.environment.hasServiceKey ? '✅' : '❌'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Database Tables</h3>
                    <div className="space-y-1 text-sm">
                      <p>Staff Table: {status.database.staffTableExists ? '✅' : '❌'}</p>
                      <p>Admin Users Table: {status.database.adminUsersTableExists ? '✅' : '❌'}</p>
                      <p>Admin User: {status.database.adminUserExists ? '✅' : '❌'}</p>
                    </div>
                  </div>
                </div>

                {status.database.adminUserData && (
                  <div>
                    <h3 className="font-semibold mb-2">Admin User Details</h3>
                    <div className="bg-white p-3 rounded border text-sm">
                      <p><strong>Email:</strong> {status.database.adminUserData.email}</p>
                      <p><strong>Name:</strong> {status.database.adminUserData.name}</p>
                      <p><strong>Active:</strong> {status.database.adminUserData.is_active ? 'Yes' : 'No'}</p>
                      <p><strong>Created:</strong> {new Date(status.database.adminUserData.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <div className="space-y-1">
                    {status.recommendations.map((rec, index) => (
                      <p key={index} className="text-sm">{rec}</p>
                    ))}
                  </div>
                </div>

                {status.error && (
                  <div>
                    <h3 className="font-semibold mb-2 text-red-700">Error Details</h3>
                    <div className="bg-red-100 p-3 rounded border border-red-200 text-sm">
                      <p><strong>Error:</strong> {status.error}</p>
                      {status.details && <p><strong>Details:</strong> {status.details}</p>}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={checkSetup} disabled={loading} variant="outline">
                <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Check
              </Button>
              
              {status?.setupStatus === 'ready' && (
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="/admin">Go to Admin Login</a>
                </Button>
              )}
              
              <Button asChild variant="outline">
                <a href="/test-supabase">Database Test</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Create Database Tables</h3>
              <p className="text-sm text-slate-600 mb-2">
                In your Supabase project dashboard, go to SQL Editor and run:
              </p>
              <code className="block bg-slate-100 p-2 rounded text-xs">
                -- Copy and paste contents of supabase/schema.sql
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Create Admin User</h3>
              <p className="text-sm text-slate-600 mb-2">
                In the SQL Editor, run:
              </p>
              <code className="block bg-slate-100 p-2 rounded text-xs">
                -- Copy and paste contents of supabase/seed.sql
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Login Credentials</h3>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm"><strong>Email:</strong> admin@sahadhospitals.com</p>
                <p className="text-sm"><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}