"use client";

import { BookOpen, User, LogOut, FileText, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success("로그아웃되었습니다.");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Image
              src="/Gemini_Generated_Image_7pw8ta7pw8ta7pw8 1-Photoroom 1.svg"
              alt="History Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-bold text-[#2D2A26]">History</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors">
              메인
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/set" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  세트
                </Link>
                <Link href="/data" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  내 문서
                </Link>
                <Link href="/transform" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  변환
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors">
                  로그인
                </Link>
                <Link href="/signup" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors">
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link
              href="/my"
              className="flex items-center gap-2 text-[#6B6762] hover:text-[#2D2A26] transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{user?.user_id || "사용자"}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#6B6762] hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">로그인</span>
          </Link>
        )}
      </div>
    </header>
  );
}
