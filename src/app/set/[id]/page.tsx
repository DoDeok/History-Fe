"use client";

import { motion } from "framer-motion";
import { useState, useMemo, use } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { HistoryCard } from "@/components/HistoryCard";

export default function SetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  // 학습 세트 목 데이터 (문서와 동일한 구조)
  const sets = [
    { 
      id: "1", 
      title: "조선시대 주요 사건",
      author: "김역사",
      thumbnail: "📜",
      content: `조선 건국 (1392년)

이성계는 위화도 회군을 통해 정권을 장악한 후, 1392년 고려를 무너뜨리고 조선을 건국했다. 수도를 한양으로 정하고 유교를 통치 이념으로 삼았다.

주요 정책:
- 과전법 실시: 토지 제도 개혁
- 경국대전 편찬: 법전 정비
- 한글 창제: 훈민정음 반포 (1446년)
- 사대교린 외교: 명과의 관계 강화

조선은 500년 이상 지속되며 한국 역사에 큰 영향을 미쳤다.`,
      hasQuestions: true,
      plays: 1234,
      avgScore: 85
    },
    { 
      id: "2", 
      title: "고려 건국과 발전",
      author: "이학습",
      thumbnail: "🏛️",
      content: "고려는 918년 왕건에 의해 건국되었으며, 후삼국을 통일하고 발전해나갔습니다.",
      hasQuestions: true,
      plays: 987,
      avgScore: 82
    },
    { 
      id: "3", 
      title: "삼국시대 역사 흐름",
      author: "박공부",
      thumbnail: "⚔️",
      content: "고구려, 백제, 신라 삼국이 경쟁하며 발전한 시기입니다.",
      hasQuestions: true,
      plays: 856,
      avgScore: 88
    },
  ];

  const set = useMemo(() => 
    sets.find(s => s.id === id),
    [id]
  );

  const [text] = useState(set?.content || "");

  if (!set) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <HistoryCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">세트를 찾을 수 없습니다</h2>
          <p className="text-[#6B6762] mb-6">요청하신 세트가 존재하지 않습니다.</p>
          <PrimaryButton onClick={() => router.push("/set")}>
            목록으로 돌아가기
          </PrimaryButton>
        </HistoryCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6">
            <button
              onClick={() => router.push("/set")}
              className="flex items-center gap-2 text-[#6B6762] hover:text-[#C9B59C] transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </button>
            <h1 className="text-4xl font-bold mb-2">{set.title}</h1>
            <p className="text-[#6B6762]">
              by {set.author} • {set.plays}명이 학습 • 평균 {set.avgScore}점
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Thumbnail */}
            <HistoryCard>
              <h3 className="text-xl font-semibold mb-4">학습 세트</h3>
              <div className="aspect-[3/4] bg-[#EFE9E3] rounded-lg flex items-center justify-center text-8xl">
                {set.thumbnail}
              </div>
              <p className="mt-4 text-sm text-[#6B6762] text-center">
                {set.title}
              </p>
            </HistoryCard>

            {/* Content Preview */}
            <HistoryCard>
              <h3 className="text-xl font-semibold mb-4">내용 미리보기</h3>

              <textarea
                value={text}
                readOnly
                className="w-full h-[500px] p-4 bg-[#F9F8F6] border border-[#DAD0C7] rounded-lg outline-none resize-none"
              />

              <div className="mt-4 p-3 bg-[#EFE9E3] rounded-lg">
                <p className="text-sm text-[#6B6762]">
                  💡 다른 사용자의 학습 세트입니다. 내용을 수정할 수 없습니다.
                </p>
              </div>
            </HistoryCard>
          </div>

          {/* Action Buttons - 문제 생성 버튼 없음, 흐름도/게임만 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <PrimaryButton 
              onClick={() => router.push(`/set/${id}/flow`)}
              className="flex items-center gap-2"
            >
              🌊 흐름도 보기
            </PrimaryButton>
            <PrimaryButton 
              onClick={() => router.push(`/game/${id}`)}
              className="flex items-center gap-2"
            >
              🎮 문제 풀기
            </PrimaryButton>
            <SecondaryButton 
              onClick={() => router.push(`/rank/${id}`)}
              className="flex items-center gap-2"
            >
              🏆 랭킹 보기
            </SecondaryButton>
            <SecondaryButton onClick={() => router.push("/set")}>
              목록으로 돌아가기
            </SecondaryButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
