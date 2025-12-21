"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Search, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { HistoryCard } from "@/components/HistoryCard";
import { toast } from "sonner";
import { cardHelpers } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

interface Card {
  id: string;
  title: string;
  content: string;
  created_at: string;
  isQuiz: boolean;
  user_id: string;
}

export default function DataPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated } = useAuthStore();

  // 사용자 인증 확인 및 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      try {
        // 자신의 문서만 가져오기
        const data = await cardHelpers.getCardsByUserId(user.id);
        setCards(data || []);
      } catch (error) {
        console.error("문서 로드 오류:", error);
        toast.error("문서를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router, isAuthenticated, user]);

  // 검색 필터링
  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 내용 미리보기 (첫 100자)
  const getPreview = (content: string) => {
    const cleaned = content.replace(/\n/g, " ").trim();
    return cleaned.length > 100 ? cleaned.substring(0, 100) + "..." : cleaned;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#C9B59C] animate-spin" />
          <p className="text-[#6B6762]">문서를 불러오는 중...</p>
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
        >
          {/* 헤더 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">내 문서</h1>
              <p className="text-[#6B6762]">
                OCR로 변환한 문서 목록입니다. ({filteredCards.length}개)
              </p>
            </div>
            <button
              onClick={() => router.push("/transform")}
              className="flex items-center gap-2 px-6 py-3 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-all"
            >
              <Plus className="h-5 w-5" />
              새 문서 변환
            </button>
          </div>

          {/* 검색 */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B6762]" />
              <input
                type="text"
                placeholder="문서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#EFE9E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9B59C] transition-all"
              />
            </div>
          </div>

          {/* 문서 목록 */}
          {filteredCards.length === 0 ? (
            <HistoryCard>
              <div className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-[#C9B59C] mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? "검색 결과가 없습니다" : "아직 문서가 없습니다"}
                </h3>
                <p className="text-[#6B6762] text-sm mb-6">
                  {searchTerm
                    ? "다른 검색어로 시도해보세요"
                    : "학습지를 업로드하여 첫 문서를 만들어보세요"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => router.push("/transform")}
                    className="px-6 py-3 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-all"
                  >
                    문서 변환하기
                  </button>
                )}
              </div>
            </HistoryCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <HistoryCard>
                    <div
                      className="cursor-pointer group"
                      onClick={() => router.push(`/data/${card.id}`)}
                    >
                      {/* 문서 아이콘 */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#C9B59C]/10 rounded-lg">
                          <FileText className="h-6 w-6 text-[#C9B59C]" />
                        </div>
                        {card.isQuiz && (
                          <span className="text-xs px-2 py-1 bg-[#C9B59C] text-white rounded-full">
                            퀴즈 생성됨
                          </span>
                        )}
                      </div>

                      {/* 제목 */}
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[#C9B59C] transition-colors line-clamp-2">
                        {card.title}
                      </h3>

                      {/* 내용 미리보기 */}
                      <p className="text-[#6B6762] text-sm mb-4 line-clamp-3">
                        {getPreview(card.content)}
                      </p>

                      {/* 날짜 */}
                      <div className="flex items-center gap-2 text-xs text-[#6B6762]">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(card.created_at)}</span>
                      </div>
                    </div>
                  </HistoryCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
