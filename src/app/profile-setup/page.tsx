"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const { pendingUserId: userId, setPendingUserId } = useAuthStore();
  const [status, setStatus] = useState('');

  useEffect(() => {
    // 스토어에서 이미 초기화됨 (checkAuth/initial)
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setStatus('저장 중...');
    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name })
      });
      const body = await res.json();
      if (body.error) {
        setStatus('오류: ' + body.error.message || body.error);
        return;
      }
      setPendingUserId(null); // localStorage와 스토어에서 모두 제거
      router.push('/');
    } catch (err: any) {
      setStatus('오류: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">프로필 설정</h2>
        <p className="mb-2">회원가입을 축하합니다! 사용할 이름을 입력하세요.</p>
        <input value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-64 mb-4" placeholder="이름" required />
        <div>
          <button type="submit" className="px-4 py-2 bg-[#C9B59C] text-white rounded">저장</button>
        </div>
        {status && <p className="mt-2">{status}</p>}
      </form>
    </div>
  )
}
