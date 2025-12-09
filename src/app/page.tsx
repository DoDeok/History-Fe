"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, TrendingUp, Gamepad2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { HistoryCard } from "@/components/HistoryCard";

export default function Home() {
  const router = useRouter();

  const popularSets = [
    { id: 1, title: "조선시대 주요 사건", plays: 1234, rating: 4.8 },
    { id: 2, title: "고려 건국과 발전", plays: 987, rating: 4.6 },
    { id: 3, title: "삼국시대 흐름", plays: 856, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="mb-6 text-4xl md:text-5xl font-bold">
            역사 공부, 이제는 재미있게
          </h1>
          <p className="text-xl text-[#6B6762] mb-8">
            학습지를 게임으로 바꿔주는 AI 플랫폼
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton onClick={() => router.push("/transform")}>
              지금 시작하기
            </PrimaryButton>
            <SecondaryButton onClick={() => router.push("/set")}>
              인기 세트 둘러보기
            </SecondaryButton>
          </div>
        </motion.div>
      </section>

      {/* Problems Section */}
      <section className="bg-[#EFE9E3] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-3xl font-bold">이런 고민 있으신가요?</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "😴", title: "재미없음", desc: "역사 공부가 지루하고 재미없어요" },
              { icon: "⏰", title: "시간 낭비", desc: "정리하고 외우는데 시간이 너무 오래 걸려요" },
              { icon: "📉", title: "비효율적", desc: "외워도 금방 잊어버리고 실력이 안 늘어요" }
            ].map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <HistoryCard>
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold">{problem.title}</h3>
                  <p className="text-[#6B6762]">{problem.desc}</p>
                </HistoryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-3xl font-bold">History가 해결해드릴게요</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: BookOpen, title: "OCR 변환", desc: "학습지를 찍으면 자동으로 텍스트 추출", color: "#C9B59C" },
              { icon: Brain, title: "AI 분석", desc: "내용을 분석해 문제 자동 생성", color: "#C9B59C" },
              { icon: TrendingUp, title: "흐름도", desc: "역사를 한눈에 보는 시각화", color: "#C9B59C" },
              { icon: Gamepad2, title: "게임화", desc: "6가지 재미있는 문제 유형", color: "#C9B59C" }
            ].map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <HistoryCard className="text-center h-full">
                  <solution.icon className="h-12 w-12 mx-auto mb-4" style={{ color: solution.color }} />
                  <h3 className="mb-2 text-lg font-semibold">{solution.title}</h3>
                  <p className="text-[#6B6762] text-sm">{solution.desc}</p>
                </HistoryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Sets Preview */}
      <section className="bg-[#EFE9E3] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-12"
          >
            <h2 className="text-3xl font-bold">인기 학습 세트</h2>
            <button 
              onClick={() => router.push("/set")}
              className="flex items-center gap-2 text-[#C9B59C] hover:text-[#B8A78B] transition-colors"
            >
              더보기
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {popularSets.map((set, i) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <HistoryCard onClick={() => router.push(`/set/${set.id}`)}>
                  <h3 className="mb-4 text-lg font-semibold">{set.title}</h3>
                  <div className="flex justify-between text-sm text-[#6B6762]">
                    <span>🎮 {set.plays}명 플레이</span>
                    <span>⭐ {set.rating}</span>
                  </div>
                </HistoryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="mb-4 text-3xl font-bold">지금 바로 시작해보세요</h2>
            <p className="text-[#6B6762] mb-8">
              학습지를 업로드하고 재미있는 역사 게임으로 변환하세요
            </p>
            <PrimaryButton onClick={() => router.push("/signup")}>
              무료로 시작하기
            </PrimaryButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

