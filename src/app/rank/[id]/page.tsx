"use client";

import { motion } from "framer-motion";
import { useState, use, useEffect } from "react";
import { Trophy, Clock, Target } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { HistoryCard } from "@/components/HistoryCard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface RankingEntry {
  rank?: number;
  user_id: string;
  name: string;
  score: number;
  total: number;
  percentage: number;
  created_at: string;
  isMe?: boolean;
}

export default function RankingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myStats, setMyStats] = useState<{ bestScore: number; playCount: number }>({
    bestScore: 0,
    playCount: 0,
  });

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // 현재 사용자 정보 가져오기
        const authToken = localStorage.getItem('sb-yfbxdujtplybaftbbmel-auth-token');
        let currentUserId = null;
        if (authToken) {
          try {
            const authData = JSON.parse(authToken);
            currentUserId = authData.user?.id;
          } catch (e) {
            console.error("토큰 파싱 오류:", e);
          }
        }

        // 전체 퀴즈 수 가져오기
        const { data: quizData, error: quizError } = await supabase
          .from("quiz")
          .select("id")
          .eq("card_id", id);

        if (quizError) throw quizError;
        const totalQuizzes = quizData?.length || 0;
        const quizIds = quizData?.map(q => q.id) || [];

        if (quizIds.length === 0) {
          setLoading(false);
          return;
        }

        // game_records에서 데이터 가져오기 (quiz_id를 통해 필터링)
        const { data: recordData, error: recordError } = await supabase
          .from("game_records")
          .select("*")
          .in("quiz_id", quizIds);

        if (recordError) throw recordError;

        // 사용자별 정답 수 집계
        const userScores = new Map<string, { correct: number; total: number; created_at: string }>();
        
        if (recordData) {
          recordData.forEach((record: any) => {
            const existing = userScores.get(record.user_id);
            if (existing) {
              existing.total++;
              if (record.is_correct) {
                existing.correct++;
              }
              // 가장 최근 기록 시간 유지
              if (new Date(record.created_at) < new Date(existing.created_at)) {
                existing.created_at = record.created_at;
              }
            } else {
              userScores.set(record.user_id, {
                correct: record.is_correct ? 1 : 0,
                total: 1,
                created_at: record.created_at,
              });
            }
          });
        }

        // users 테이블에서 user_id로 사용자 정보 가져오기
        const userIds = Array.from(userScores.keys());
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, user_id")
          .in("id", userIds);  // game_records의 user_id는 UUID이므로 users.id와 매칭

        if (usersError) {
          console.error("Users 데이터 로딩 오류:", usersError);
        }

        // UUID -> user_id 매핑
        const uuidToUserId = new Map<string, string>();
        if (usersData && usersData.length > 0) {
          usersData.forEach((user: any) => {
            uuidToUserId.set(user.id, user.user_id);
          });
        }

        // 랭킹 배열로 변환
        const rankedList: RankingEntry[] = Array.from(userScores.entries())
          .filter(([_, stats]) => stats.total === totalQuizzes) // 모든 문제를 푼 사용자만
          .map(([uuid, stats]) => ({
            user_id: uuid,
            name: uuidToUserId.get(uuid) || uuid.substring(0, 8) + "...", // users 테이블의 user_id (text) 표시
            score: stats.correct,
            total: totalQuizzes,
            percentage: Math.round((stats.correct / totalQuizzes) * 100),
            created_at: stats.created_at,
            isMe: currentUserId === uuid,
          }))
          .sort((a, b) => {
            if (b.percentage !== a.percentage) {
              return b.percentage - a.percentage;
            }
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          })
          .map((entry, index) => ({
            ...entry,
            rank: index + 1,
          }));

        setRankings(rankedList);

        // 내 통계 계산
        if (currentUserId) {
          const myRecords = recordData?.filter((r: any) => r.user_id === currentUserId) || [];
          const myCorrect = myRecords.filter((r: any) => r.is_correct).length;
          const myTotal = myRecords.length;
          const percentage = myTotal > 0 ? Math.round((myCorrect / myTotal) * 100) : 0;
          
          setMyStats({
            bestScore: percentage,
            playCount: myTotal > 0 ? Math.floor(myTotal / totalQuizzes) : 0,
          });
        }
      } catch (err: any) {
        console.error("랭킹 데이터 로딩 오류:", err);
        toast.error("랭킹 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [id]);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <HistoryCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">랭킹을 불러오는 중...</h2>
          <p className="text-[#6B6762]">잠시만 기다려주세요.</p>
        </HistoryCard>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <Image 
                src="/ranking.svg"
                alt="Ranking Icon"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              랭킹
            </h1>
            <p className="text-[#6B6762]">
              다른 사용자들과 실력을 겨뤄보세요
            </p>
          </div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid sm:grid-cols-2 gap-4 mb-8"
          >
            <HistoryCard className="text-center">
              <p className="text-sm text-[#6B6762] mb-1">내 최고 점수</p>
              <p className="text-2xl font-bold text-[#C9B59C]">{myStats.bestScore}%</p>
            </HistoryCard>
            <HistoryCard className="text-center">
              <p className="text-sm text-[#6B6762] mb-1">플레이 횟수</p>
              <p className="text-2xl font-bold text-[#C9B59C]">{myStats.playCount}회</p>
            </HistoryCard>
          </motion.div>

          {/* Rankings List */}
          <HistoryCard className="mb-8">
            {rankings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#6B6762] mb-4">아직 랭킹 데이터가 없습니다.</p>
                <PrimaryButton onClick={() => router.push(`/game/${id}`)}>
                  첫 번째로 도전하기
                </PrimaryButton>
              </div>
            ) : (
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
                    {entry.rank && getMedalIcon(entry.rank) ? (
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
                      <span>{entry.percentage}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{entry.score}/{entry.total}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold text-[#C9B59C]">
                      {entry.percentage}%
                    </span>
                  </div>
                </motion.div>
              ))}
              </div>
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
