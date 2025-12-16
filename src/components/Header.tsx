"use client";

import { BookOpen, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <BookOpen className="h-6 w-6 text-[#C9B59C]" />
            <span className="font-bold text-[#2D2A26]">History</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors">
              메인
            </Link>
            <Link href="/set" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors">
              세트
            </Link>
            <Link href="/login" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors">
              로그인
            </Link>
            <Link href="/signup" className="text-[#6B6762] hover:text-[#2D2A26] transition-colors">
              회원가입
            </Link>
          </nav>
        </div>
        
        <Link href="/my" className="flex items-center gap-2 text-[#6B6762] hover:text-[#2D2A26] transition-colors">
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">마이페이지</span>
        </Link>
      </div>
    </header>
  );
}
