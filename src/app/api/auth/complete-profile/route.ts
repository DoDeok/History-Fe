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

    const { userId, name } = await request.json()
    if (!userId || !name) return NextResponse.json({ error: 'invalid' }, { status: 400 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (admin as any).from('users').upsert({ id: userId, user_id: name, created_at: new Date().toISOString() }, { onConflict: 'id' })
    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
