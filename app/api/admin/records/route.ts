import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

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

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await checkAdminAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('staff')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error counting records:', countError)
      return NextResponse.json(
        { error: 'Failed to count records' },
        { status: 500 }
      )
    }

    // Fetch paginated records
    const { data: records, error } = await supabaseAdmin
      .from('staff')
      .select('id, staff_id, name, department, national_tin, fct_irs_tax_id, status, submitted_at, has_submitted')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching records:', error)
      return NextResponse.json(
        { error: 'Failed to fetch records' },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({ 
      records: records || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Records API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await checkAdminAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { staff_id, name, department, national_tin, fct_irs_tax_id, status } = await request.json()

    // Validate required fields
    if (!staff_id?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: 'staff_id and name are required' },
        { status: 400 }
      )
    }

    // Clean staff_id (no format validation, just trim)
    const cleanStaffId = staff_id.trim()

    // Check if staff_id already exists
    const { data: existingRecord, error: checkError } = await supabaseAdmin
      .from('staff')
      .select('id')
      .eq('staff_id', cleanStaffId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing staff_id:', checkError)
      return NextResponse.json(
        { error: 'Failed to validate staff_id' },
        { status: 500 }
      )
    }

    if (existingRecord) {
      return NextResponse.json(
        { error: 'staff_id already exists' },
        { status: 400 }
      )
    }

    // Determine if record should be marked as submitted
    const hasTaxIds = !!(national_tin?.trim() || fct_irs_tax_id?.trim())
    
    // Create record
    const { error } = await supabaseAdmin
      .from('staff')
      .insert({
        staff_id: cleanStaffId,
        name: name.trim(),
        department: department?.trim() || null,
        national_tin: national_tin?.trim() || null,
        fct_irs_tax_id: fct_irs_tax_id?.trim() || null,
        status: status || 'pending',
        has_submitted: hasTaxIds,
        submitted_at: hasTaxIds ? new Date().toISOString() : null
      })

    if (error) {
      console.error('Error creating record:', error)
      return NextResponse.json(
        { error: 'Failed to create record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Create record API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    // Check authentication
    const session = await checkAdminAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { recordId, status } = await request.json()

    if (!recordId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Update record status
    const { error } = await supabaseAdmin
      .from('staff')
      .update({ 
        status: status, 
        reviewed_at: new Date().toISOString() 
      })
      .eq('id', recordId)

    if (error) {
      console.error('Error updating record:', error)
      return NextResponse.json(
        { error: 'Failed to update record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Update record API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = await checkAdminAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { recordId, staff_id, name, department, national_tin, fct_irs_tax_id, status } = await request.json()

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!staff_id?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: 'staff_id and name are required' },
        { status: 400 }
      )
    }

    // Clean staff_id (no format validation, just trim)
    const cleanStaffId = staff_id.trim()

    // Check if staff_id is already taken by another record
    const { data: existingRecord, error: checkError } = await supabaseAdmin
      .from('staff')
      .select('id')
      .eq('staff_id', cleanStaffId)
      .neq('id', recordId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing staff_id:', checkError)
      return NextResponse.json(
        { error: 'Failed to validate staff_id' },
        { status: 500 }
      )
    }

    if (existingRecord) {
      return NextResponse.json(
        { error: 'staff_id already exists for another record' },
        { status: 400 }
      )
    }

    // Determine if record should be marked as submitted
    const hasTaxIds = !!(national_tin?.trim() || fct_irs_tax_id?.trim())
    
    // Update record
    const { error } = await supabaseAdmin
      .from('staff')
      .update({
        staff_id: cleanStaffId,
        name: name.trim(),
        department: department?.trim() || null,
        national_tin: national_tin?.trim() || null,
        fct_irs_tax_id: fct_irs_tax_id?.trim() || null,
        status: status || 'pending',
        has_submitted: hasTaxIds,
        submitted_at: hasTaxIds ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', recordId)

    if (error) {
      console.error('Error updating record:', error)
      return NextResponse.json(
        { error: 'Failed to update record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Update record API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = await checkAdminAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const recordId = searchParams.get('id')

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      )
    }

    // Delete record
    const { error } = await supabaseAdmin
      .from('staff')
      .delete()
      .eq('id', recordId)

    if (error) {
      console.error('Error deleting record:', error)
      return NextResponse.json(
        { error: 'Failed to delete record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete record API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}