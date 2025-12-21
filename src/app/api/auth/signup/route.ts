import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE

// 빌드 타임에 환경 변수가 없으면 에러를 던지지 않도록 처리
let admin: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  admin = createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: Request) {
  try {
    if (!admin) {
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      );
    }

    const { email, password, name } = await request.json()
    const { data, error } = await admin.auth.signUp({ email, password, options: { data: { name } } })
    if (error) return NextResponse.json({ error }, { status: 400 })

    // 유저가 만들어지면 users 테이블에 프로필 저장
    const userId = data?.user?.id
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('users').upsert({ id: userId, user_id: name, password: null, created_at: new Date().toISOString() }, { onConflict: 'id' })
    }

    return NextResponse.json({ data })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
