"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { HistoryInput } from "@/components/HistoryInput";
import GithubAuthButton from "../../components/GithubAuthButton";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function SignupPage() {
  useAuthRedirect(); // OAuth 토큰이 URL에 붙으면 /auth로 리디렉션
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const [formData, setFormData] = useState({
    user_id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        user_id: formData.user_id,
        email: formData.email,
        password: formData.password,
      });
      toast.success("회원가입 성공!");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
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
                label="아이디"
                type="text"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                placeholder="아이디를 입력하세요"
                required
              />

              <HistoryInput
                label="이메일 (선택사항)"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="이메일을 입력하세요"
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

              <div className="flex items-center gap-3 my-2">
                <hr className="flex-1 border-t border-gray-200" />
                <span className="text-sm text-[#6B6762]">또는</span>
                <hr className="flex-1 border-t border-gray-200" />
              </div>

              <GithubAuthButton />

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
