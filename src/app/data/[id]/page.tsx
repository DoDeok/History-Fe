"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Calendar, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2,
  Copy,
  Check,
  GitBranch,
  HelpCircle
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { HistoryCard } from "@/components/HistoryCard";
import { toast } from "sonner";
import { cardHelpers } from "@/lib/supabase";

interface Card {
  id: string;
  title: string;
  content: string;
  created_at: string;
  isQuiz: boolean;
  user_id: string;
}

export default function DataDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dataId = params?.id as string;
  
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [generatingFlow, setGeneratingFlow] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // 사용자 인증 확인 및 데이터 로드
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      const user = JSON.parse(storedUser);
      setUserId(user.id);

      try {
        const data = await cardHelpers.getCardById(dataId);
        setCard(data);
        
        // 소유자 확인
        setIsOwner(data.user_id === user.id);
        
        if (data.user_id !== user.id) {
          toast.error("접근 권한이 없습니다.");
          router.push("/data");
          return;
        }
      } catch (error) {
        console.error("문서 로드 오류:", error);
        toast.error("문서를 찾을 수 없습니다.");
        router.push("/data");
      } finally {
        setLoading(false);
      }
    };

    if (dataId) {
      checkAuthAndLoadData();
    }
  }, [dataId, router]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 내용 복사
  const handleCopy = async () => {
    if (!card) return;
    
    try {
      await navigator.clipboard.writeText(card.content);
      setCopied(true);
      toast.success("내용이 복사되었습니다.");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("복사에 실패했습니다.");
    }
  };

  // 문서 삭제
  const handleDelete = async () => {
    if (!card || !isOwner) return;
    
    if (!confirm("정말 이 문서를 삭제하시겠습니까?")) return;

    setDeleting(true);
    try {
      await cardHelpers.deleteCard(card.id);
      toast.success("문서가 삭제되었습니다.");
      router.push("/data");
    } catch (error) {
      console.error("삭제 오류:", error);
      toast.error("문서 삭제에 실패했습니다.");
      setDeleting(false);
    }
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

  if (!card) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FileText className="h-12 w-12 text-[#C9B59C]" />
          <p className="text-[#6B6762]">문서를 찾을 수 없습니다.</p>
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
          {/* 뒤로가기 */}
          <button
            onClick={() => router.push("/data")}
            className="flex items-center gap-2 text-[#6B6762] hover:text-[#3D3A36] mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            목록으로 돌아가기
          </button>

          {/* 헤더 카드 */}
          <HistoryCard>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#C9B59C]/10 rounded-lg">
                    <FileText className="h-8 w-8 text-[#C9B59C]" />
                  </div>
                  {card.isQuiz && (
                    <span className="text-xs px-2 py-1 bg-[#C9B59C] text-white rounded-full">
                      퀴즈 생성됨
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{card.title}</h1>
                <div className="flex items-center gap-2 text-sm text-[#6B6762]">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(card.created_at)}</span>
                </div>
              </div>

              {/* 액션 버튼들 */}
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F5F3F0] text-[#3D3A36] rounded-lg hover:bg-[#EFE9E3] transition-colors"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "복사됨" : "복사"}
                  </button>
                  <button
                    onClick={() => router.push(`/edit/${card.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    삭제
                  </button>
                </div>
              )}
            </div>
          </HistoryCard>

          {/* 내용 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6"
          >
            <HistoryCard>
              <h2 className="text-lg font-semibold mb-4">문서 내용</h2>
              <div className="bg-[#F5F3F0] rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-[#3D3A36] font-sans leading-relaxed">
                    {card.content}
                  </pre>
                </div>
              </div>
            </HistoryCard>
          </motion.div>

          {/* 추가 액션들 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6"
          >
            <HistoryCard>
              <h2 className="text-lg font-semibold mb-4">추가 작업</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={async () => {
                    if (!card) return;
                    setGeneratingFlow(true);
                    try {
                      const response = await fetch("/api/generate-flow", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          cardId: card.id,
                          content: card.content,
                          userId: userId,
                        }),
                      });
                      
                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "흐름도 생성 실패");
                      }
                      
                      toast.success("흐름도가 생성되었습니다!");
                      router.push(`/set/${card.id}/flow`);
                    } catch (error: any) {
                      console.error("흐름도 생성 오류:", error);
                      toast.error(error.message || "흐름도 생성에 실패했습니다.");
                    } finally {
                      setGeneratingFlow(false);
                    }
                  }}
                  disabled={generatingFlow}
                  className="flex-1 min-w-[200px] px-6 py-4 bg-[#F5F3F0] text-[#3D3A36] rounded-lg hover:bg-[#EFE9E3] transition-colors text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {generatingFlow ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <GitBranch className="h-5 w-5" />
                    )}
                    <h3 className="font-semibold">
                      {generatingFlow ? "흐름도 생성 중..." : "흐름도 생성"}
                    </h3>
                  </div>
                  <p className="text-sm text-[#6B6762]">
                    {generatingFlow 
                      ? "AI가 역사적 사건을 분석하고 있습니다" 
                      : "역사적 사건을 시간순으로 정리합니다"}
                  </p>
                </button>
                <button
                  onClick={() => router.push(`/set/${card?.id}/makeCard`)}
                  disabled={generatingQuiz}
                  className="flex-1 min-w-[200px] px-6 py-4 bg-[#F5F3F0] text-[#3D3A36] rounded-lg hover:bg-[#EFE9E3] transition-colors text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <HelpCircle className="h-5 w-5" />
                    <h3 className="font-semibold">퀴즈 생성</h3>
                  </div>
                  <p className="text-sm text-[#6B6762]">학습 내용 기반 퀴즈를 만듭니다</p>
                </button>
              </div>
            </HistoryCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
