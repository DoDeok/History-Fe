"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setAuth, setPendingUserId } = useAuthStore();
  const [status, setStatus] = useState<string>("시작");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setStatus('세션 확인 중...');
      try {
        // 1) 먼저 기존 세션이 있는지 확인
        let { data: sessionData } = await supabase.auth.getSession();
        let session = sessionData?.session;

        // 2) 세션이 없으면 URL에서 토큰 파싱 시도
        if (!session) {
          setStatus('리디렉션 토큰 파싱 중...');
          const parseTokens = () => {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash || window.location.search);
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');
            return { access_token, refresh_token };
          };

          const { access_token, refresh_token } = parseTokens();
          console.log('parsed tokens', { access_token, refresh_token });

          if (access_token) {
            setStatus('세션 설정 중...');
            try {
              const { data: setData, error: setError } = await supabase.auth.setSession({
                access_token: access_token as string,
                refresh_token: (refresh_token as string) ?? undefined
              });
              console.log('setSession result', { setData, setError });
              if (setError) {
                setErrorMsg(String(setError.message || setError));
              }

              const refreshed = await supabase.auth.getSession();
              session = refreshed.data?.session || null;
            } catch (err: any) {
              console.error('setSession error', err);
              setErrorMsg(String(err.message || err));
            }
          }
        }

        if (!session) {
          console.error('No session after redirect');
          setErrorMsg('세션을 획득하지 못했습니다.');
          setStatus('실패');
          return;
        }

        const user = session.user;
        setStatus('사용자 DB 업데이트 중...');

        // users 테이블에 user_id(이름)로 저장
        try {
          // user_metadata에 이름 정보가 있으면 사용하고, 없으면 user.id 사용
          const displayName = (user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name || user.id;
          const { data: upsertData, error: upsertError } = await supabase.from('users').upsert({
            id: user.id,
            user_id: displayName,
            password: null,
            created_at: new Date().toISOString()
          }, { onConflict: 'id' });
          console.log('upsert result', { upsertData, upsertError });
          if (upsertError) {
            setErrorMsg(String((upsertError as any).message || upsertError));
          }
        } catch (err: any) {
          console.error('users upsert error', err);
          setErrorMsg(String(err.message || err));
        }

        // Generate JWT token via API
        setStatus('JWT 토큰 생성 중...');
        try {
          const response = await fetch('/api/auth/oauth-callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id,
              email: user.email,
              display_name: (user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name || user.id,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate JWT');
          }

          const { user: userData } = await response.json();

          // Update Zustand store
          setAuth(userData);
          setPendingUserId(null); // 작업 완료 후 제거
        } catch (err: any) {
          console.error('JWT generation error', err);
          setErrorMsg(String(err.message || err));
        }

        // URL 프래그먼트 정리(토큰 제거)
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        setStatus('완료, 메인으로 이동');
        setTimeout(() => router.push('/'), 800);
      } catch (err: any) {
        console.error('auth callback overall error', err);
        setErrorMsg(String(err.message || err));
        setStatus('에러');
      }
    })();
  }, [router, setAuth]);

  return (
    <>
      <div className="fixed inset-0 bg-[#F9F8F6] flex items-center justify-center z-50">
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-14 h-14 border-4 border-[#C9B59C] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </>
  );
}
