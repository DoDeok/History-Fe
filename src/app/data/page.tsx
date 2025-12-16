"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, FolderOpen, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function DataListPage() {
  const router = useRouter();

  const documents = [
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
    <div className="min-h-screen bg-[#F9F8F6] py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">내 문서</h1>
              <p className="text-[#6B6762]">
                업로드한 학습지를 관리하고 문제를 생성하세요
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

          {documents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {documents.map((doc, i) => (
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <HistoryCard className="max-w-md mx-auto">
                <FolderOpen className="h-16 w-16 mx-auto mb-4 text-[#DAD0C7]" />
                <h3 className="text-xl font-semibold mb-2">아직 문서가 없어요</h3>
                <p className="text-[#6B6762]">
                  학습지를 업로드하고 AI 문제를 만들어보세요
                </p>
              </HistoryCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
