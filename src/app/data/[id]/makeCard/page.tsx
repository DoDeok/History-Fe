"use client";

import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { HistoryCard } from "@/components/HistoryCard";
import confetti from "canvas-confetti";

export default function MakeCardPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { label: "텍스트 분석 중...", progress: 25 },
    { label: "핵심 키워드 추출 중...", progress: 50 },
    { label: "문제 생성 중...", progress: 75 },
    { label: "검증 및 최적화 중...", progress: 100 },
  ];

  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C9B59C', '#DAD0C7', '#EFE9E3']
          });
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [isComplete]);

  useEffect(() => {
    const stepIndex = Math.floor(progress / 25);
    setCurrentStep(Math.min(stepIndex, steps.length - 1));
  }, [progress]);

  const questionTypes = [
    { name: "순서 맞추기", count: 5, icon: "📊" },
    { name: "다음 사건", count: 5, icon: "🔮" },
    { name: "결과 선택", count: 5, icon: "🎯" },
    { name: "인물 연결", count: 5, icon: "👥" },
    { name: "의의 파악", count: 5, icon: "💡" },
    { name: "원인 추론", count: 5, icon: "🔍" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {!isComplete ? (
            <>
              <div className="text-center mb-12">
                <div className="inline-block p-4 bg-[#EFE9E3] rounded-full mb-6">
                  <Loader2 className="h-12 w-12 text-[#C9B59C] animate-spin" />
                </div>
                <h1 className="text-4xl font-bold mb-2">🤖 AI가 문제를 생성하고 있어요...</h1>
                <p className="text-[#6B6762]">
                  잠시만 기다려주세요. 거의 다 됐어요!
                </p>
              </div>

              <HistoryCard className="mb-8">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#6B6762]">진행률</span>
                    <span className="text-sm font-medium text-[#C9B59C]">{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#EFE9E3] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C9B59C] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        index <= currentStep ? 'bg-[#EFE9E3]' : 'bg-transparent'
                      }`}
                    >
                      {index < currentStep ? (
                        <div className="flex-shrink-0 w-6 h-6 bg-[#C9B59C] rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : index === currentStep ? (
                        <Loader2 className="h-6 w-6 text-[#C9B59C] animate-spin flex-shrink-0" />
                      ) : (
                        <div className="flex-shrink-0 w-6 h-6 border-2 border-[#DAD0C7] rounded-full" />
                      )}
                      <span className={index <= currentStep ? 'text-[#2D2A26]' : 'text-[#6B6762]'}>
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </HistoryCard>

              <p className="text-center text-[#6B6762] text-sm">
                거의 다 됐어요! 30초만 더 기다려주세요 😊
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-4xl font-bold mb-2">생성 완료!</h1>
                <p className="text-[#6B6762]">
                  총 30개의 문제가 생성되었어요
                </p>
              </div>

              <HistoryCard className="mb-8">
                <h3 className="text-xl font-semibold mb-6">생성된 문제 유형</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {questionTypes.map((type, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-[#EFE9E3] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <span className="text-[#C9B59C] font-medium">{type.count}문</span>
                    </motion.div>
                  ))}
                </div>
              </HistoryCard>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PrimaryButton onClick={() => router.push(`/set/${id}/flow`)}>
                  흐름도 보기
                </PrimaryButton>
                <SecondaryButton onClick={() => router.push(`/game/${id}`)}>
                  문제 풀기
                </SecondaryButton>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
