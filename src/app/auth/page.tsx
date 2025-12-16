"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
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
              const { data: setData, error: setError } = await supabase.auth.setSession({ access_token: access_token as string, refresh_token: (refresh_token as string) ?? undefined });
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
            password: null, // nullable로 변경 권장
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
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="font-bold mb-2">Auth 콜백 처리</h2>
        <p>상태: {status}</p>
        {errorMsg && (
          <pre className="mt-2 text-sm text-red-600">{errorMsg}</pre>
        )}
        <p className="mt-2 text-xs text-gray-500">콘솔 로그도 확인하세요 (F12)</p>
      </div>
    </div>
  );
}
