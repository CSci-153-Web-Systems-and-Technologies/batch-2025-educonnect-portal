import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, role, fullName } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, supabaseServiceKey: !!supabaseServiceKey })
      return NextResponse.json({ error: 'Server configuration error: missing Supabase credentials' }, { status: 500 })
    }

    // Use service role key to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })

    let table = role === 'teacher' ? 'teachers' : 'parents'
    let payload = role === 'teacher'
      ? { id: userId, full_name: fullName }
      : { id: userId, phone_number: null }

    const { error } = await supabaseAdmin
      .from(table)
      .insert(payload)

    if (error) {
      console.error(`Profile creation error (${table}):`, error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Profile creation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
