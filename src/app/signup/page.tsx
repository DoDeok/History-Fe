"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { HistoryInput } from "@/components/HistoryInput";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직
    router.push("/login");
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
          <h1 className="text-4xl font-bold text-center mb-8">회원가입</h1>
          
          <HistoryCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <HistoryInput
                label="이름"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="이름을 입력하세요"
                required
              />
              
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
              
              <HistoryInput
                label="비밀번호 확인"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              
              <PrimaryButton type="submit" className="w-full">
                가입하기
              </PrimaryButton>
              
              <p className="text-center text-sm text-[#6B6762]">
                이미 계정이 있으신가요?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-[#C9B59C] hover:text-[#B8A78B] transition-colors"
                >
                  로그인
                </button>
              </p>
            </form>
          </HistoryCard>
        </motion.div>
      </div>
    </div>
  );
}
