"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Loader2,
  RotateCcw
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

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const dataId = params?.id as string;
  
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
        
        // 소유자 확인
        if (data.user_id !== user.id) {
          toast.error("접근 권한이 없습니다.");
          router.push("/data");
          return;
        }

        setCard(data);
        setTitle(data.title);
        setContent(data.content);
        setOriginalTitle(data.title);
        setOriginalContent(data.content);
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

  // 변경사항 감지
  useEffect(() => {
    setHasChanges(title !== originalTitle || content !== originalContent);
  }, [title, content, originalTitle, originalContent]);

  // 저장
  const handleSave = async () => {
    if (!card) return;
    
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      await cardHelpers.updateCard(card.id, {
        title: title.trim(),
        content: content.trim(),
      });

      setOriginalTitle(title.trim());
      setOriginalContent(content.trim());
      toast.success("문서가 저장되었습니다.");
      
      // 상세 페이지로 이동
      router.push(`/data/${card.id}`);
    } catch (error) {
      console.error("저장 오류:", error);
      toast.error("문서 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 초기화
  const handleReset = () => {
    if (!confirm("변경사항을 취소하시겠습니까?")) return;
    
    setTitle(originalTitle);
    setContent(originalContent);
    toast.info("변경사항이 취소되었습니다.");
  };

  // 페이지 이탈 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

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
            onClick={() => {
              if (hasChanges) {
                if (confirm("저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?")) {
                  router.push(`/data/${card.id}`);
                }
              } else {
                router.push(`/data/${card.id}`);
              }
            }}
            className="flex items-center gap-2 text-[#6B6762] hover:text-[#3D3A36] mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            문서로 돌아가기
          </button>

          {/* 헤더 */}
          <HistoryCard>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C9B59C]/10 rounded-lg">
                  <FileText className="h-8 w-8 text-[#C9B59C]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">문서 수정</h1>
                  <p className="text-sm text-[#6B6762]">문서의 제목과 내용을 수정할 수 있습니다</p>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  disabled={!hasChanges || saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F5F3F0] text-[#3D3A36] rounded-lg hover:bg-[#EFE9E3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="h-4 w-4" />
                  초기화
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>

            {/* 변경사항 표시 */}
            {hasChanges && (
              <div className="mt-4 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                저장하지 않은 변경사항이 있습니다.
              </div>
            )}
          </HistoryCard>

          {/* 제목 입력 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6"
          >
            <HistoryCard>
              <label className="block text-lg font-semibold mb-3">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="문서 제목을 입력하세요"
                className="w-full px-4 py-3 bg-[#F5F3F0] border border-[#EFE9E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9B59C] transition-all"
              />
            </HistoryCard>
          </motion.div>

          {/* 내용 입력 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6"
          >
            <HistoryCard>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-lg font-semibold">내용</label>
                <span className="text-sm text-[#6B6762]">
                  {content.length.toLocaleString()}자
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="문서 내용을 입력하세요"
                rows={20}
                className="w-full px-4 py-3 bg-[#F5F3F0] border border-[#EFE9E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9B59C] transition-all resize-none font-mono text-sm leading-relaxed"
              />
            </HistoryCard>
          </motion.div>

          {/* 하단 저장 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 flex justify-end gap-4"
          >
            <button
              onClick={() => {
                if (hasChanges) {
                  if (confirm("저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?")) {
                    router.push(`/data/${card.id}`);
                  }
                } else {
                  router.push(`/data/${card.id}`);
                }
              }}
              className="px-6 py-3 bg-[#F5F3F0] text-[#3D3A36] rounded-lg hover:bg-[#EFE9E3] transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="px-6 py-3 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "저장 중..." : "변경사항 저장"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
