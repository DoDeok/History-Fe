import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!

const admin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    const { data, error } = await admin.auth.signUp({ email, password, options: { data: { name } } })
    if (error) return NextResponse.json({ error }, { status: 400 })

    // 유저가 만들어지면 users 테이블에 프로필 저장
    const userId = data?.user?.id
    if (userId) {
      await admin.from('users').upsert({ id: userId, user_id: name, password: null, created_at: new Date().toISOString() }, { onConflict: 'id' })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
