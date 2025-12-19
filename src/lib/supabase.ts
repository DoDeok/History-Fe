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

// 문서(Cards) 관련 함수들
export const cardHelpers = {
  // 모든 카드 가져오기
  getAllCards: async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // 특정 사용자의 카드만 가져오기
  getCardsByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // 특정 카드 가져오기
  getCardById: async (id: string) => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 카드 생성
  createCard: async (card: {
    title: string;
    content: string;
    user_id: string;
    isQuiz?: boolean;
  }) => {
    const { data, error } = await supabase
      .from('cards')
      .insert(card)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 카드 업데이트
  updateCard: async (id: string, updates: {
    title?: string;
    content?: string;
    isQuiz?: boolean;
  }) => {
    const { data, error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 카드 삭제
  deleteCard: async (id: string) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // 카드가 자신의 것인지 확인
  isCardOwner: async (cardId: string, userId: string) => {
    const { data, error } = await supabase
      .from('cards')
      .select('user_id')
      .eq('id', cardId)
      .single();
    
    if (error) throw error;
    return data?.user_id === userId;
  }
};

// 기존 documentHelpers는 호환성을 위해 유지 (deprecated)
export const documentHelpers = {
  // 모든 문서 가져오기
  getAllDocuments: async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // 특정 문서 가져오기
  getDocumentById: async (id: string) => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 문서 생성
  createDocument: async (document: {
    title: string;
    content: string;
    user_id?: string;
  }) => {
    const { data, error } = await supabase
      .from('cards')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 문서 업데이트
  updateDocument: async (id: string, updates: {
    title?: string;
    content?: string;
  }) => {
    const { data, error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 문서 삭제
  deleteDocument: async (id: string) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
