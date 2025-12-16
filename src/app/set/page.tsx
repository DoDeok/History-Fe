"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { HistoryCard } from "@/components/HistoryCard";

export default function SetListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"latest" | "popular">("popular");

  const sets = [
    {
      id: 1,
      title: "조선시대 주요 사건",
      author: "김역사",
      plays: 1234,
      avgScore: 85,
      thumbnail: "📜",
      createdAt: "2024.11.28",
      topRanker: "김역사"
    },
    {
      id: 2,
      title: "고려 건국과 발전",
      author: "이학습",
      plays: 987,
      avgScore: 82,
      thumbnail: "🏛️",
      createdAt: "2024.11.25",
      topRanker: "박공부"
    },
    {
      id: 3,
      title: "삼국시대 역사 흐름",
      author: "박공부",
      plays: 856,
      avgScore: 88,
      thumbnail: "⚔️",
      createdAt: "2024.11.20",
      topRanker: "이학습"
    },
    {
      id: 4,
      title: "일제강점기 독립운동",
      author: "최독립",
      plays: 743,
      avgScore: 90,
      thumbnail: "🕊️",
      createdAt: "2024.11.15",
      topRanker: "정민주"
    },
    {
      id: 5,
      title: "대한민국 임시정부",
      author: "정민주",
      plays: 621,
      avgScore: 87,
      thumbnail: "🏛️",
      createdAt: "2024.11.10",
      topRanker: "최독립"
    },
    {
      id: 6,
      title: "6.25 전쟁과 분단",
      author: "강평화",
      plays: 589,
      avgScore: 83,
      thumbnail: "🕊️",
      createdAt: "2024.11.05"
    },
  ];

  const sortedSets = [...sets].sort((a, b) => {
    if (filter === "popular") return b.plays - a.plays;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">학습 세트</h1>
            <p className="text-[#6B6762]">
              다른 사용자들이 만든 학습 세트를 둘러보세요
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter("popular")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "popular"
                  ? "bg-[#C9B59C] text-white"
                  : "bg-[#EFE9E3] text-[#6B6762] hover:bg-[#DAD0C7]"
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                인기순
              </span>
            </button>
            <button
              onClick={() => setFilter("latest")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "latest"
                  ? "bg-[#C9B59C] text-white"
                  : "bg-[#EFE9E3] text-[#6B6762] hover:bg-[#DAD0C7]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                최신순
              </span>
            </button>
          </div>

          {/* Set Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSets.map((set, i) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <HistoryCard onClick={() => router.push(`/set/${set.id}`)}>
                  <div className="aspect-video bg-[#EFE9E3] rounded-lg flex items-center justify-center mb-4 text-6xl">
                    {set.thumbnail}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{set.title}</h3>
                  <p className="text-sm text-[#6B6762] mb-2">by {set.author}</p>
                  <div className="mb-4 p-2 bg-[#FFF5E6] rounded-lg border border-[#FFD89C]">
                    <p className="text-sm">
                      <span className="font-semibold text-[#C9B59C]">🏆 1등:</span>
                      <span className="ml-1 text-[#6B6762]">{set.topRanker}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-[#6B6762]">
                      <span>🎮 {set.plays}명</span>
                      <span>📊 평균 {set.avgScore}점</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#EFE9E3]">
                    <button className="w-full py-2 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-colors text-sm">
                      자세히 보기
                    </button>
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
