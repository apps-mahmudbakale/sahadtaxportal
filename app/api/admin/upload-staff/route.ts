import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Papa from 'papaparse'

// Use service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAdminAuth() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return null
    }

    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
    
    // Check if session is expired (7 days)
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - sessionData.loginTime > sevenDaysInMs) {
      return null
    }

    return sessionData
  } catch (error) {
    return null
  }
}

interface StaffRow {
  staff_id: string
  name: string
  department: string
  national_tin?: string
  fct_irs_tax_id?: string
}

// Helper function to clean field values
function cleanField(value: string | undefined | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await checkAdminAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV' },
        { status: 400 }
      )
    }

    // Read file content
    const fileContent = await file.text()

    // Parse CSV
    const parseResult = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim().replace(/\s+/g, '_')
    })

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'CSV parsing failed',
          details: parseResult.errors.map(err => err.message)
        },
        { status: 400 }
      )
    }

    const rows = parseResult.data as StaffRow[]

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'CSV file is empty' },
        { status: 400 }
      )
    }

    // Validate required columns
    const requiredColumns = ['staff_id', 'name']
    const firstRow = rows[0]
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))

    if (missingColumns.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required columns',
          details: `Required columns: ${requiredColumns.join(', ')}. Missing: ${missingColumns.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Process and validate rows
    const validRows: StaffRow[] = []
    const errors: string[] = []

    rows.forEach((row, index) => {
      const rowNumber = index + 2 // +2 because index starts at 0 and we skip header

      // Validate required fields
      if (!row.staff_id?.trim()) {
        errors.push(`Row ${rowNumber}: staff_id is required`)
        return
      }
      if (!row.name?.trim()) {
        errors.push(`Row ${rowNumber}: name is required`)
        return
      }

      // Clean staff_id (no format validation)
      const staffId = row.staff_id.trim()

      // Clean and validate department field
      const department = cleanField(row.department)

      validRows.push({
        staff_id: staffId,
        name: row.name.trim(),
        department: department,
        national_tin: cleanField(row.national_tin),
        fct_irs_tax_id: cleanField(row.fct_irs_tax_id)
      })
    })

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      )
    }

    // Insert staff records
    const staffRecords = validRows.map(row => ({
      staff_id: row.staff_id,
      name: row.name,
      department: row.department,
      national_tin: row.national_tin,
      fct_irs_tax_id: row.fct_irs_tax_id,
      status: 'pending',
      has_submitted: !!(row.national_tin || row.fct_irs_tax_id),
      submitted_at: (row.national_tin || row.fct_irs_tax_id) ? new Date().toISOString() : null
    }))

    const { data, error } = await supabaseAdmin
      .from('staff')
      .upsert(staffRecords, { 
        onConflict: 'staff_id',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to insert staff records',
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${validRows.length} staff records`,
      inserted: data?.length || 0,
      records: validRows.length
    })

  } catch (error) {
    console.error('Upload staff API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}