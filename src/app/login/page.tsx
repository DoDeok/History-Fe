"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { HistoryInput } from "@/components/HistoryInput";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-8">로그인</h1>
          
          <HistoryCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <HistoryInput
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="이메일을 입력하세요"
                required
              />
              
              <HistoryInput
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="비밀번호를 입력하세요"
                required
              />
              
              <PrimaryButton type="submit" className="w-full">
                로그인
              </PrimaryButton>
              
              <p className="text-center text-sm text-[#6B6762]">
                계정이 없으신가요?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="text-[#C9B59C] hover:text-[#B8A78B] transition-colors"
                >
                  회원가입
                </button>
              </p>
            </form>
          </HistoryCard>
        </motion.div>
      </div>
    </div>
  );
}
