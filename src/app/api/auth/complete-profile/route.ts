import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!

const admin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { userId, name } = await request.json()
    if (!userId || !name) return NextResponse.json({ error: 'invalid' }, { status: 400 })

    const { data, error } = await admin.from('users').upsert({ id: userId, user_id: name, created_at: new Date().toISOString() }, { onConflict: 'id' })
    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
