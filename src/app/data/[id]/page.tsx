"use client";

import { motion } from "framer-motion";
import { useState, useMemo, use } from "react";
import { Save, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { HistoryCard } from "@/components/HistoryCard";
import { toast } from "sonner";

export default function DataDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  // 목 데이터
  const documents = [
    { 
      id: "1", 
      title: "조선시대 주요 사건 정리",
      thumbnail: "📜",
      questionCount: 30,
      content: `조선 건국 (1392년)

이성계는 위화도 회군을 통해 정권을 장악한 후, 1392년 고려를 무너뜨리고 조선을 건국했다. 수도를 한양으로 정하고 유교를 통치 이념으로 삼았다.

주요 정책:
- 과전법 실시: 토지 제도 개혁
- 경국대전 편찬: 법전 정비
- 한글 창제: 훈민정음 반포 (1446년)
- 사대교린 외교: 명과의 관계 강화

조선은 500년 이상 지속되며 한국 역사에 큰 영향을 미쳤다.`
    },
    { 
      id: "2", 
      title: "고려 건국과 발전 과정",
      thumbnail: "🏛️",
      questionCount: 25,
      content: "고려는 918년 왕건에 의해 건국되었으며, 후삼국을 통일하고 발전해나갔습니다."
    },
    { 
      id: "3", 
      title: "삼국시대 역사 흐름",
      thumbnail: "⚔️",
      questionCount: 28,
      content: "고구려, 백제, 신라 삼국이 경쟁하며 발전한 시기입니다."
    },
    { 
      id: "4", 
      title: "일제강점기 독립운동",
      thumbnail: "🕊️",
      questionCount: 22,
      content: "1910년부터 1945년까지 일제의 식민 지배에 맞서 독립운동이 전개되었습니다."
    },
    { 
      id: "5", 
      title: "새로 업로드한 학습지",
      thumbnail: "📄",
      questionCount: 0,
      content: "방금 업로드한 학습지의 내용입니다. AI가 텍스트를 추출하고 분석 중입니다..."
    },
  ];

  const document = useMemo(() => 
    documents.find(doc => doc.id === id),
    [id]
  );

  const [text, setText] = useState(document?.content || "");

  const handleSave = () => {
    toast.success("저장 완료! 잘 보관했어요 ✅");
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <HistoryCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">문서를 찾을 수 없습니다</h2>
          <p className="text-[#6B6762] mb-6">요청하신 문서가 존재하지 않습니다.</p>
          <PrimaryButton onClick={() => router.push("/data")}>
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
              onClick={() => router.push("/data")}
              className="flex items-center gap-2 text-[#6B6762] hover:text-[#C9B59C] transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </button>
            <h1 className="text-4xl font-bold mb-2">{document.title}</h1>
            <p className="text-[#6B6762]">
              추출된 텍스트를 확인하고 수정할 수 있어요
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Original Image */}
            <HistoryCard>
              <h3 className="text-xl font-semibold mb-4">원본 이미지</h3>
              <div className="aspect-[3/4] bg-[#EFE9E3] rounded-lg flex items-center justify-center text-8xl">
                {document.thumbnail}
              </div>
              <p className="mt-4 text-sm text-[#6B6762] text-center">
                {document.title}
              </p>
            </HistoryCard>

            {/* Extracted Text */}
            <HistoryCard>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">추출된 텍스트</h3>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 text-[#C9B59C] hover:text-[#B8A78B] transition-colors text-sm"
                >
                  <Save className="h-4 w-4" />
                  저장
                </button>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-[500px] p-4 bg-white border border-[#DAD0C7] rounded-lg focus:border-[#C9B59C] focus:ring-2 focus:ring-[#C9B59C]/20 outline-none resize-none"
              />

              <div className="mt-4 p-3 bg-[#EFE9E3] rounded-lg">
                <p className="text-sm text-[#6B6762]">
                  💡 자동 저장이 활성화되어 있어요. 변경사항은 자동으로 저장됩니다.
                </p>
              </div>
            </HistoryCard>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            {document.questionCount === 0 ? (
              <PrimaryButton 
                onClick={() => router.push(`/data/${id}/makeCard`)}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                AI 문제 생성하기
              </PrimaryButton>
            ) : (
              <>
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
              </>
            )}
            <SecondaryButton onClick={() => router.push("/data")}>
              목록으로 돌아가기
            </SecondaryButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
