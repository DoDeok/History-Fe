"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { HistoryCard } from "@/components/HistoryCard";

export default function SetListPage() {
  const router = useRouter();

  const sets = [
    { id: 1, title: "조선시대 주요 사건", plays: 1234, rating: 4.8, description: "조선시대의 중요한 역사적 사건들을 학습합니다" },
    { id: 2, title: "고려 건국과 발전", plays: 987, rating: 4.6, description: "고려의 건국부터 발전 과정까지" },
    { id: 3, title: "삼국시대 흐름", plays: 856, rating: 4.7, description: "고구려, 백제, 신라의 역사" },
    { id: 4, title: "독립운동사", plays: 743, rating: 4.9, description: "일제강점기 독립운동의 역사" },
    { id: 5, title: "대한민국 현대사", plays: 621, rating: 4.5, description: "광복 이후 현대사의 주요 사건들" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-center mb-4">학습 세트</h1>
          <p className="text-center text-[#6B6762] mb-12">
            다양한 역사 학습 세트를 선택해보세요
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sets.map((set, i) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <HistoryCard onClick={() => router.push(`/set/${set.id}`)}>
                  <h3 className="text-xl font-semibold mb-2">{set.title}</h3>
                  <p className="text-[#6B6762] text-sm mb-4">{set.description}</p>
                  <div className="flex justify-between text-sm text-[#6B6762]">
                    <span>🎮 {set.plays}명 플레이</span>
                    <span>⭐ {set.rating}</span>
                  </div>
                </HistoryCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
