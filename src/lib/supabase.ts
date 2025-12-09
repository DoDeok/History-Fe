import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase 환경 변수가 설정되지 않았습니다. ' +
    '.env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase 연결 테스트 함수
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error && error.code !== 'PGRST116') {
      // PGRST116은 테이블이 없다는 에러 - 연결은 성공
      throw error;
    }
    
    return {
      success: true,
      message: 'Supabase 연결 성공!',
      data: data || null
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Supabase 연결 실패',
      error
    };
  }
}

// 인증 관련 함수들
export const authHelpers = {
  // 회원가입
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  // 로그인
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // 로그아웃
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 현재 사용자 가져오기
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
