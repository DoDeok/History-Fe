"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * OAuth 리디렉션 후 URL에 access_token이 붙어있으면
 * /auth 페이지로 토큰과 함께 리디렉션하는 훅
 */
export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // /auth 페이지에서는 실행하지 않음 (무한 루프 방지)
    if (pathname === "/auth") return;

    // URL 해시에 access_token이 있는지 확인
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      // /auth 페이지로 해시와 함께 리디렉션
      router.replace(`/auth${hash}`);
    }
  }, [pathname, router]);
}
