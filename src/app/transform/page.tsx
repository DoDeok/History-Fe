"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, Check, FileText, Image, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { HistoryCard } from "@/components/HistoryCard";
import { toast } from "sonner";
import { cardHelpers } from "@/lib/supabase";

export default function TransformPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "saving" | "complete">("idle");
  const [extractedContent, setExtractedContent] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // 사용자 인증 확인
  useEffect(() => {
    const checkAuth = async () => {
      // localStorage에서 사용자 정보 확인 (기존 인증 방식에 맞춤)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
      } else {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const supportedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf"
    ];

    if (!supportedTypes.includes(selectedFile.type)) {
      toast.error("지원하지 않는 파일 형식입니다. JPEG, PNG, GIF, WebP, PDF만 지원합니다.");
      return;
    }

    // 파일 크기 제한 (20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error("파일 크기는 20MB 이하여야 합니다.");
      return;
    }

    setFile(selectedFile);
    handleUpload(selectedFile);
  };

  const handleUpload = async (selectedFile: File) => {
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setUploading(true);
    setProgress(0);
    setStatus("uploading");

    try {
      // 1단계: 파일 업로드 진행
      setProgress(20);
      setStatus("uploading");
      
      const formData = new FormData();
      formData.append("file", selectedFile);

      // 2단계: OCR 처리
      setProgress(40);
      setStatus("processing");
      
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "OCR 처리 실패");
      }

      const result = await response.json();
      setProgress(70);
      
      setExtractedContent(result.content);

      // 3단계: Supabase에 저장
      setProgress(85);
      setStatus("saving");

      const newCard = await cardHelpers.createCard({
        title: result.suggestedTitle,
        content: result.content,
        user_id: userId,
        isQuiz: false,
      });

      setProgress(100);
      setStatus("complete");
      toast.success("문서가 성공적으로 변환되었습니다!");

      // 1.5초 후 문서 상세 페이지로 이동
      setTimeout(() => {
        router.push(`/data/${newCard.id}`);
      }, 1500);

    } catch (error) {
      console.error("업로드 오류:", error);
      toast.error(error instanceof Error ? error.message : "파일 처리 중 오류가 발생했습니다.");
      resetUpload();
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setStatus("idle");
    setExtractedContent("");
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-16 w-16 text-[#C9B59C]" />;
    if (file.type === "application/pdf") {
      return <FileText className="h-16 w-16 text-[#C9B59C]" />;
    }
    return <Image className="h-16 w-16 text-[#C9B59C]" />;
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "파일 업로드 중...";
      case "processing":
        return "OCR 변환 중...";
      case "saving":
        return "문서 저장 중...";
      case "complete":
        return "변환 완료!";
      default:
        return "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-4">학습지 변환</h1>
          <p className="text-center text-[#6B6762] mb-8">
            학습지를 업로드하면 AI가 자동으로 텍스트를 추출합니다
          </p>
          
          {/* 지원 형식 안내 */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-[#6B6762]">
              <Image className="h-4 w-4" />
              <span>JPEG, PNG, GIF, WebP</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B6762]">
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </div>
          </div>
          
          <HistoryCard>
            {!uploading ? (
              <div
                className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors ${
                  dragActive
                    ? "border-[#C9B59C] bg-[#C9B59C]/10"
                    : "border-[#EFE9E3]"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {getFileIcon()}
                <h3 className="text-lg font-semibold mb-2 mt-4">학습지 업로드</h3>
                <p className="text-[#6B6762] text-sm mb-4 text-center">
                  이미지 또는 PDF 파일을 드래그하거나 클릭하여 선택하세요
                  <br />
                  <span className="text-xs">(최대 20MB)</span>
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="inline-block px-6 py-3 bg-[#C9B59C] text-white rounded-lg hover:bg-[#B8A78B] transition-all">
                    파일 선택
                  </span>
                </label>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12">
                {status !== "complete" ? (
                  <>
                    <Loader2 className="h-16 w-16 text-[#C9B59C] mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold mb-2">{getStatusText()}</h3>
                    {file && (
                      <div className="flex items-center gap-2 text-[#6B6762] text-sm mb-6">
                        {file.type === "application/pdf" ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <Image className="h-4 w-4" />
                        )}
                        <span>{file.name}</span>
                        <span className="text-xs">({formatFileSize(file.size)})</span>
                      </div>
                    )}
                    <div className="w-full max-w-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-[#6B6762]">진행률</span>
                        <span className="text-sm font-medium text-[#C9B59C]">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#EFE9E3] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#C9B59C] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                    
                    {/* 취소 버튼 */}
                    <button
                      onClick={resetUpload}
                      className="mt-6 flex items-center gap-2 text-sm text-[#6B6762] hover:text-[#3D3A36] transition-colors"
                    >
                      <X className="h-4 w-4" />
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <div className="inline-block p-4 bg-[#C9B59C]/10 rounded-full mb-4">
                      <Check className="h-16 w-16 text-[#C9B59C]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">변환 완료!</h3>
                    <p className="text-[#6B6762] text-sm mb-2">
                      문서가 성공적으로 저장되었습니다.
                    </p>
                    <p className="text-[#6B6762] text-xs">
                      문서 상세 페이지로 이동합니다...
                    </p>
                  </>
                )}
              </div>
            )}
          </HistoryCard>

          {/* 미리보기 (추출된 내용이 있을 때) */}
          {extractedContent && status === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-6"
            >
              <HistoryCard>
                <h3 className="text-lg font-semibold mb-4">추출된 내용 미리보기</h3>
                <div className="bg-[#F5F3F0] rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-sm text-[#3D3A36] whitespace-pre-wrap">
                    {extractedContent.substring(0, 500)}
                    {extractedContent.length > 500 && "..."}
                  </p>
                </div>
              </HistoryCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
