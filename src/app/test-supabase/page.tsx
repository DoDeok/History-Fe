"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { testSupabaseConnection } from "@/lib/supabase";

export default function TestSupabasePage() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await testSupabaseConnection();
      setResult(response);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "연결 테스트 중 오류 발생"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-center mb-4">
            Supabase 연결 테스트
          </h1>
          <p className="text-center text-[#6B6762] mb-12">
            데이터베이스 연결 상태를 확인하세요
          </p>

          <HistoryCard>
            <div className="text-center">
              <Database className="h-20 w-20 mx-auto mb-6 text-[#C9B59C]" />
              
              <h2 className="text-2xl font-semibold mb-4">연결 테스트</h2>
              <p className="text-[#6B6762] mb-6">
                버튼을 클릭하여 Supabase 데이터베이스 연결을 테스트하세요
              </p>

              <PrimaryButton
                onClick={handleTest}
                disabled={testing}
                className="w-full flex items-center justify-center gap-2"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    테스트 중...
                  </>
                ) : (
                  "연결 테스트 시작"
                )}
              </PrimaryButton>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-lg ${
                    result.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        result.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result.success ? "성공" : "실패"}
                    </span>
                  </div>
                  <p
                    className={
                      result.success ? "text-green-700" : "text-red-700"
                    }
                  >
                    {result.message}
                  </p>
                </motion.div>
              )}
            </div>
          </HistoryCard>

          <HistoryCard className="mt-6">
            <h3 className="font-semibold mb-3">설정 방법</h3>
            <ol className="text-sm text-[#6B6762] space-y-2 list-decimal list-inside">
              <li>
                Supabase 프로젝트 생성 (
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9B59C] hover:underline"
                >
                  supabase.com
                </a>
                )
              </li>
              <li>프로젝트 설정에서 API URL과 anon key 복사</li>
              <li>
                <code className="bg-[#EFE9E3] px-2 py-1 rounded">.env.local</code> 파일에 추가:
                <pre className="mt-2 bg-[#EFE9E3] p-3 rounded overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
              </li>
              <li>개발 서버 재시작</li>
            </ol>
          </HistoryCard>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>참고:</strong> .env.local 파일은 Git에 커밋하지 마세요.
              이미 .gitignore에 포함되어 있습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
