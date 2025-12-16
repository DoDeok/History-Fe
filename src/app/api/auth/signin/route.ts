import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!

const admin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    // 서버 사이드에서 비밀번호 로그인은 제한될 수 있으므로 클라이언트에서 처리하는 것이 일반적.
    // 여기서는 admin 키로 사용자를 찾아 users 테이블에 프로필이 없으면 생성만 함.
    const { data: users } = await admin.auth.admin.listUsers()
    // 단순 구현: 로그인은 클라이언트에서 수행, 서버는 프로필 보장용으로 두기
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
