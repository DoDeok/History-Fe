"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, BookOpen, Trophy, FileText, Calendar, Plus, Sparkles, Loader2 } from "lucide-react";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { cardHelpers, supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface CardData {
  id: string;
  title: string;
  content: string;
  created_at: string;
  isQuiz: boolean;
}

interface GameRecord {
  id: string;
  card_id: string;
  is_correct: boolean;
  created_at: string;
  cards?: {
    title: string;
  }[];
}

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const [myCards, setMyCards] = useState<CardData[]>([]);
  const [gameRecords, setGameRecords] = useState<GameRecord[]>([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    totalPlays: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      try {
        // 내 카드(문서) 가져오기
        const cards = await cardHelpers.getCardsByUserId(user.id);
        setMyCards(cards || []);

        // 게임 기록 가져오기
        const { data: records, error: recordsError } = await supabase
          .from("game_records")
          .select(`
            id,
            card_id,
            is_correct,
            created_at,
            cards (
              title
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (!recordsError && records) {
          setGameRecords(records as GameRecord[]);
        }

        // 통계 계산
        const totalCards = cards?.length || 0;

        // 게임 플레이 수 계산
        const { count: playCount } = await supabase
          .from("game_records")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // 정답률 계산
        const { data: correctData } = await supabase
          .from("game_records")
          .select("is_correct")
          .eq("user_id", user.id);

        let avgScore = 0;
        if (correctData && correctData.length > 0) {
          const correctCount = correctData.filter(r => r.is_correct).length;
          avgScore = Math.round((correctCount / correctData.length) * 100);
        }

        setStats({
          totalCards,
          totalPlays: playCount || 0,
          averageScore: avgScore,
        });

      } catch (error) {
        console.error("데이터 로드 오류:", error);
        toast.error("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router, isAuthenticated, user]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return date.toLocaleDateString("ko-KR");
  };

  // 썸네일 이모지 생성
  const getThumbnail = (title: string) => {
    if (title.includes("조선")) return "📜";
    if (title.includes("고려")) return "🏛️";
    if (title.includes("삼국")) return "⚔️";
    if (title.includes("일제") || title.includes("독립")) return "🕊️";
    if (title.includes("현대") || title.includes("민주")) return "🗳️";
    return "📚";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#C9B59C] animate-spin" />
          <p className="text-[#6B6762]">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-12">마이페이지</h1>

          {/* 프로필 카드 */}
          <HistoryCard className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#C9B59C] flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{user?.user_id}</h2>
                <p className="text-[#6B6762]">{user?.email}</p>
              </div>
            </div>
          </HistoryCard>

          {/* 통계 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <HistoryCard className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-2 text-[#C9B59C]" />
              <h3 className="text-3xl font-bold mb-1">{stats.totalCards}</h3>
              <p className="text-[#6B6762]">내 문서</p>
            </HistoryCard>

            <HistoryCard className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-2 text-[#C9B59C]" />
              <h3 className="text-3xl font-bold mb-1">{stats.totalPlays}</h3>
              <p className="text-[#6B6762]">총 플레이</p>
            </HistoryCard>

            <HistoryCard className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-3xl font-bold mb-1">{stats.averageScore}%</h3>
              <p className="text-[#6B6762]">정답률</p>
            </HistoryCard>
          </div>

          {/* 내가 만든 세트 */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">내가 만든 문서</h2>
            <PrimaryButton
              onClick={() => router.push("/transform")}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              새 문서 만들기
            </PrimaryButton>
          </div>

          {myCards.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {myCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <HistoryCard
                    className="cursor-pointer"
                    onClick={() => router.push(`/data/${card.id}`)}
                  >
                    <div className="aspect-video bg-[#EFE9E3] rounded-lg flex items-center justify-center mb-4 text-6xl">
                      {getThumbnail(card.title)}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{card.title}</h3>
                    <div className="flex items-center justify-between text-sm text-[#6B6762]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(card.created_at)}</span>
                      </div>
                      {card.isQuiz && (
                        <div className="flex items-center gap-1 text-[#C9B59C]">
                          <Sparkles className="h-4 w-4" />
                          <span>퀴즈</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#EFE9E3]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/data/${card.id}`);
                        }}
                        className="w-full py-2 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-colors text-sm"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </HistoryCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <HistoryCard className="text-center py-12 mb-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">아직 만든 문서가 없어요</h3>
              <p className="text-[#6B6762] mb-6">학습지를 업로드하고 문서를 만들어보세요!</p>
              <PrimaryButton
                onClick={() => router.push("/transform")}
                className="inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                첫 문서 만들기
              </PrimaryButton>
            </HistoryCard>
          )}

          {/* 최근 학습 기록 */}
          <h2 className="text-2xl font-bold mb-4">최근 학습 기록</h2>
          {gameRecords.length > 0 ? (
            <div className="space-y-4">
              {gameRecords.slice(0, 5).map((record) => (
                <HistoryCard key={record.id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {record.cards?.[0]?.title || "퀴즈"}
                      </h3>
                      <p className="text-sm text-[#6B6762]">{formatDate(record.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${record.is_correct ? 'text-green-500' : 'text-red-500'}`}>
                        {record.is_correct ? "정답" : "오답"}
                      </div>
                    </div>
                  </div>
                </HistoryCard>
              ))}
            </div>
          ) : (
            <HistoryCard className="text-center py-8">
              <p className="text-[#6B6762]">아직 학습 기록이 없습니다.</p>
            </HistoryCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}
