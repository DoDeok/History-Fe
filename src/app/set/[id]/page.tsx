"use client";

import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import { Save, Sparkles, ArrowLeft, Play } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { HistoryCard } from "@/components/HistoryCard";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface CardData {
  id: string;
  title: string;
  content: string;
  user_id: string;
  isQuiz: boolean;
}

export default function DataDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [document, setDocument] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    // 로컬스토리지에서 사용자 정보 가져오기
    const authToken = localStorage.getItem('sb-yfbxdujtplybaftbbmel-auth-token');
    if (authToken) {
      try {
        const authData = JSON.parse(authToken);
        setCurrentUserId(authData.user?.id || null);
      } catch (error) {
        console.error("로컬스토리지 파싱 오류:", error);
      }
    }

    // cards 테이블에서 데이터 가져오기
    const fetchCard = async () => {
      try {
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          setDocument(data);
          setText(data.content || "");
        }
      } catch (err: any) {
        console.error("카드 데이터 로딩 오류:", err);
        toast.error("문서를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleSave = () => {
    toast.success("저장 완료! 잘 보관했어요 ✅");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <HistoryCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">문서를 찾을 수 없습니다</h2>
          <p className="text-[#6B6762] mb-6">요청하신 문서가 존재하지 않습니다.</p>
          <PrimaryButton onClick={() => router.push("/set")}>
            목록으로 돌아가기
          </PrimaryButton>
        </HistoryCard>
      </div>
    );
  }

  // 사용자가 카드의 소유자인지 확인
  const isOwner = currentUserId && document.user_id === currentUserId;

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
            <h1 className="text-4xl font-bold mb-2">{document.title}</h1>
            <p className="text-[#6B6762]">
              추출된 텍스트를 확인하고 수정할 수 있어요
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Original Content Display */}
            <HistoryCard>
              <h3 className="text-xl font-semibold mb-4">문서 정보</h3>
              <div className="aspect-[3/4] bg-[#EFE9E3] rounded-lg flex items-center justify-center p-8 overflow-auto">
                <div className="text-sm whitespace-pre-wrap">
                  {document.content}
                </div>
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
            {!document.isQuiz && isOwner ? (
              <PrimaryButton 
                onClick={() => router.push(`/set/${id}/makeCard`)}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                AI 문제 생성하기
              </PrimaryButton>
            ) : document.isQuiz ? (
              <>
                <PrimaryButton 
                  onClick={() => router.push(`/set/${id}/flow`)}
                  className="flex items-center gap-2"
                >
                  <Image 
                    src="/flow.svg"
                    alt="Flow Icon"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  흐름도 보기
                </PrimaryButton>
                <PrimaryButton 
                  onClick={() => router.push(`/game/${id}`)}
                  className="flex items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  게임 시작
                </PrimaryButton>
                <SecondaryButton 
                  onClick={() => router.push(`/rank/${id}`)}
                  className="flex items-center gap-2"
                >
                  <Image 
                    src="/ranking.svg"
                    alt="Ranking Icon"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  랭킹 보기
                </SecondaryButton>
              </>
            ) : null}
            <SecondaryButton onClick={() => router.push("/set")}>
              목록으로 돌아가기
            </SecondaryButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
