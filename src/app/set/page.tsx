"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TrendingUp, Clock, FileText, Calendar, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

interface Card {
  id: string;
  title: string;
  created_at: string;
  isQuiz: boolean;
  user_id: string;
}

export default function SetListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"latest" | "popular">("latest");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {

    // cards 테이블에서 데이터 가져오기
    const fetchCards = async () => {
      try {
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setCards(data);
        }
      } catch (err: any) {
        console.error("카드 데이터 로딩 오류:", err);
        toast.error("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const sortedCards = [...cards].sort((a, b) => {
    if (filter === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0; // popular 정렬은 추후 구현
  });

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">학습 세트</h1>
              <p className="text-[#6B6762]">
                학습지를 관리하고 문제를 생성하세요
              </p>
            </div>
            <PrimaryButton
              onClick={() => router.push("/transform")}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              새 문서 만들기
            </PrimaryButton>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter("latest")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === "latest"
                  ? "bg-[#C9B59C] text-white"
                  : "bg-[#EFE9E3] text-[#6B6762] hover:bg-[#DAD0C7]"
                }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                최신순
              </span>
            </button>
            <button
              onClick={() => setFilter("popular")}
              className={`px-4 py-2 rounded-lg transition-all ${filter === "popular"
                  ? "bg-[#C9B59C] text-white"
                  : "bg-[#EFE9E3] text-[#6B6762] hover:bg-[#DAD0C7]"
                }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                인기순
              </span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-[#6B6762]">로딩 중...</p>
            </div>
          ) : cards.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <HistoryCard onClick={() => router.push(`/set/${card.id}`)}>
                    <div className="aspect-video bg-[#EFE9E3] rounded-lg flex items-center justify-center mb-4 text-6xl">
                      📄
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{card.title}</h3>
                    <div className="flex items-center justify-between text-sm text-[#6B6762] mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(card.created_at).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{card.isQuiz ? "퀴즈 있음" : "퀴즈 없음"}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#EFE9E3]">
                      <button className="w-full py-2 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-colors text-sm mb-2">
                        자세히 보기
                      </button>
                      {!card.isQuiz && user?.id === card.user_id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/set/${card.id}/makeCard`);
                          }}
                          className="w-full py-2 bg-[#EFE9E3] text-[#6B6762] rounded-lg hover:bg-[#DAD0C7] transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          문제 생성하기
                        </button>
                      )}
                    </div>
                  </HistoryCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <HistoryCard className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold mb-2">아직 문서가 없어요</h3>
                <p className="text-[#6B6762] mb-6">
                  새로운 학습지를 만들어 문제를 생성해보세요
                </p>
                <PrimaryButton onClick={() => router.push("/transform")}>
                  <Plus className="h-5 w-5 mr-2" />
                  첫 문서 만들기
                </PrimaryButton>
              </HistoryCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
