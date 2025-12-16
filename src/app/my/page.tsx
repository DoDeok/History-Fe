"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, BookOpen, Trophy, FileText, Calendar, Plus, Sparkles } from "lucide-react";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function MyPage() {
  const router = useRouter();

  const myStats = {
    totalPlays: 45,
    totalSets: 12,
    averageScore: 87.5,
  };

  const recentSets = [
    { id: 1, title: "조선시대 주요 사건", lastPlayed: "2일 전", score: 92 },
    { id: 2, title: "고려 건국과 발전", lastPlayed: "5일 전", score: 85 },
    { id: 3, title: "삼국시대 흐름", lastPlayed: "1주일 전", score: 90 },
  ];

  // 내가 만든 문서/세트
  const myDocuments = [
    { 
      id: "1", 
      title: "조선시대 주요 사건 정리", 
      date: "2024.11.28",
      thumbnail: "📜",
      questionCount: 30
    },
    { 
      id: "2", 
      title: "고려 건국과 발전 과정", 
      date: "2024.11.25",
      thumbnail: "🏛️",
      questionCount: 25
    },
    { 
      id: "3", 
      title: "삼국시대 역사 흐름", 
      date: "2024.11.20",
      thumbnail: "⚔️",
      questionCount: 28
    },
    { 
      id: "4", 
      title: "일제강점기 독립운동", 
      date: "2024.11.15",
      thumbnail: "🕊️",
      questionCount: 22
    },
    { 
      id: "5", 
      title: "새로 업로드한 학습지", 
      date: "2024.12.16",
      thumbnail: "📄",
      questionCount: 0
    },
  ];

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
                <h2 className="text-2xl font-bold mb-1">사용자 이름</h2>
                <p className="text-[#6B6762]">user@example.com</p>
              </div>
            </div>
          </HistoryCard>

          {/* 통계 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <HistoryCard className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-2 text-[#C9B59C]" />
              <h3 className="text-3xl font-bold mb-1">{myStats.totalSets}</h3>
              <p className="text-[#6B6762]">학습한 세트</p>
            </HistoryCard>
            
            <HistoryCard className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-2 text-[#C9B59C]" />
              <h3 className="text-3xl font-bold mb-1">{myStats.totalPlays}</h3>
              <p className="text-[#6B6762]">총 플레이</p>
            </HistoryCard>
            
            <HistoryCard className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-3xl font-bold mb-1">{myStats.averageScore}%</h3>
              <p className="text-[#6B6762]">평균 점수</p>
            </HistoryCard>
          </div>

          {/* 내가 만든 세트 */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">내가 만든 세트</h2>
            <PrimaryButton 
              onClick={() => router.push("/transform")}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              새 문서 만들기
            </PrimaryButton>
          </div>

          {myDocuments.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {myDocuments.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <HistoryCard onClick={() => router.push(`/data/${doc.id}`)}>
                    <div className="aspect-video bg-[#EFE9E3] rounded-lg flex items-center justify-center mb-4 text-6xl">
                      {doc.thumbnail}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{doc.title}</h3>
                    <div className="flex items-center justify-between text-sm text-[#6B6762]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{doc.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{doc.questionCount}문</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#EFE9E3]">
                      <button className="w-full py-2 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-colors text-sm mb-2">
                        자세히 보기
                      </button>
                      {doc.questionCount === 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/data/${doc.id}/makeCard`);
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
            <HistoryCard className="text-center py-12 mb-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">아직 만든 세트가 없어요</h3>
              <p className="text-[#6B6762] mb-6">새 문서를 업로드하고 학습 세트를 만들어보세요!</p>
              <PrimaryButton 
                onClick={() => router.push("/transform")}
                className="inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                첫 문서 만들기
              </PrimaryButton>
            </HistoryCard>
          )}

          {/* 최근 학습 */}
          <h2 className="text-2xl font-bold mb-4">최근 학습</h2>
          <div className="space-y-4">
            {recentSets.map((set) => (
              <HistoryCard key={set.id} onClick={() => router.push(`/set/${set.id}`)}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{set.title}</h3>
                    <p className="text-sm text-[#6B6762]">{set.lastPlayed}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#C9B59C]">{set.score}점</div>
                  </div>
                </div>
              </HistoryCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
