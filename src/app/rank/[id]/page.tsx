"use client";

import { motion } from "framer-motion";
import { useState, use } from "react";
import { Trophy, Clock, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { HistoryCard } from "@/components/HistoryCard";

interface RankingEntry {
  rank: number;
  name: string;
  score: number;
  accuracy: number;
  time: string;
  isMe?: boolean;
}

export default function RankingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [filter, setFilter] = useState<"all" | "today" | "week">("all");

  const rankings: RankingEntry[] = [
    { rank: 1, name: "김역사", score: 950, accuracy: 95, time: "12:30" },
    { rank: 2, name: "이학습", score: 920, accuracy: 92, time: "13:15" },
    { rank: 3, name: "박공부", score: 890, accuracy: 89, time: "14:20" },
    { rank: 4, name: "최독립", score: 870, accuracy: 87, time: "11:45" },
    { rank: 5, name: "정민주", score: 850, accuracy: 85, time: "15:30" },
    { rank: 6, name: "강평화", score: 830, accuracy: 83, time: "16:10" },
    { rank: 7, name: "윤역사", score: 810, accuracy: 81, time: "12:50" },
    { rank: 8, name: "임학습", score: 800, accuracy: 80, time: "13:40" },
    { rank: 9, name: "한공부", score: 790, accuracy: 79, time: "14:25" },
    { rank: 10, name: "송실력", score: 785, accuracy: 78, time: "15:15" },
    { rank: 15, name: "나", score: 780, accuracy: 78, time: "16:20", isMe: true },
  ];

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-[#C9B59C]/10 rounded-full mb-4">
              <Trophy className="h-12 w-12 text-[#C9B59C]" />
            </div>
            <h1 className="text-4xl font-bold mb-2">🏆 랭킹</h1>
            <p className="text-[#6B6762]">
              다른 사용자들과 실력을 겨뤄보세요
            </p>
          </div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid sm:grid-cols-2 gap-4"
          >
            <HistoryCard className="text-center">
              <p className="text-sm text-[#6B6762] mb-1">내 최고 점수</p>
              <p className="text-2xl font-bold text-[#C9B59C]">780점</p>
            </HistoryCard>
            <HistoryCard className="text-center">
              <p className="text-sm text-[#6B6762] mb-1">플레이 횟수</p>
              <p className="text-2xl font-bold text-[#C9B59C]">5회</p>
            </HistoryCard>
          </motion.div>
          {/* Rankings List */}
          <HistoryCard className="mb-8">
            <div className="space-y-2">
              {rankings.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    entry.isMe
                      ? "bg-[#C9B59C]/10 border-2 border-[#C9B59C]"
                      : "bg-[#EFE9E3] hover:bg-[#DAD0C7]"
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    {getMedalIcon(entry.rank) ? (
                      <span className="text-3xl">{getMedalIcon(entry.rank)}</span>
                    ) : (
                      <span className="text-lg font-bold text-[#6B6762]">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${entry.isMe ? "text-[#C9B59C]" : ""}`}>
                        {entry.name}
                      </span>
                      {entry.isMe && (
                        <span className="px-2 py-0.5 bg-[#C9B59C] text-white text-xs rounded-full">
                          나
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 text-sm text-[#6B6762]">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{entry.accuracy}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{entry.time}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold text-[#C9B59C]">
                      {entry.score}
                    </span>
                    <span className="text-sm text-[#6B6762]">점</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* My Rank Highlight (if not in top 10) */}
            {rankings.find((r) => r.isMe && r.rank > 10) && (
              <>
                <div className="my-4 border-t border-[#DAD0C7]" />
                <div className="text-center text-sm text-[#6B6762] mb-2">
                  ... {rankings.find((r) => r.isMe)!.rank - 10 - 1}명 ...
                </div>
              </>
            )}
          </HistoryCard>

          {/* Action Button */}
          <div className="text-center">
            <PrimaryButton onClick={() => router.push(`/game/${id}`)}>
              다시 도전하기
            </PrimaryButton>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
