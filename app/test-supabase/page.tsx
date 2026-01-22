"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing...")
  const [staffCount, setStaffCount] = useState<number | null>(null)
  const [authUsers, setAuthUsers] = useState<any[]>([])

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('staff')
        .select('count')
        .limit(1)

      if (error) {
        setConnectionStatus(`Connection Error: ${error.message}`)
        return
      }

      // Get staff count
      const { count } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })

      setStaffCount(count)
      setConnectionStatus("✅ Database connection successful!")

    } catch (err) {
      setConnectionStatus(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const createTestUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@sahadhospitals.com',
        password: '12345678',
      })

      if (error) {
        alert(`Error creating user: ${error.message}`)
      } else {
        alert('Test user created! Check your email for confirmation.')
      }
    } catch (err) {
      alert(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@sahadhospitals.com',
        password: '12345678',
      })

      if (error) {
        alert(`Login Error: ${error.message}`)
      } else {
        alert('Login successful!')
        console.log('User data:', data.user)
      }
    } catch (err) {
      alert(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Connection Status:</strong>
              <p className="mt-1">{connectionStatus}</p>
            </div>
            
            {staffCount !== null && (
              <div>
                <strong>Staff Records:</strong>
                <p className="mt-1">{staffCount} records found</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={testConnection} variant="outline">
                Test Connection
              </Button>
              <Button onClick={createTestUser} variant="outline">
                Create Test User
              </Button>
              <Button onClick={testLogin} variant="outline">
                Test Login
              </Button>
            </div>

            <div className="mt-4 p-4 bg-slate-100 rounded">
              <h3 className="font-semibold mb-2">Environment Check:</h3>
              <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">Setup Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Run the database schema from <code>supabase/schema.sql</code></li>
                <li>Run the seed data from <code>supabase/seed.sql</code></li>
                <li>Create admin user in Supabase Auth dashboard</li>
                <li>Or use "Create Test User" button above</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}