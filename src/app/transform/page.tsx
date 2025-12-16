"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { toast } from "sonner";

export default function TransformPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile: File) => {
    setUploading(true);
    setProgress(0);

    // 업로드 진행 시뮬레이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // 2초 후 완료
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      toast.success("파일 업로드 완료!");
      
      // 새 문서 ID 생성 (실제로는 서버에서 받아올 ID)
      const newDocId = "5";
      
      // 1초 후 상세 페이지로 이동
      setTimeout(() => {
        router.push(`/data/${newDocId}`);
      }, 1000);
    }, 2000);
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
            학습지를 업로드하면 AI가 자동으로 문제를 생성해드립니다
          </p>
          
          <HistoryCard>
            {!uploading ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#EFE9E3] rounded-lg">
                <Upload className="h-16 w-16 text-[#C9B59C] mb-4" />
                <h3 className="text-lg font-semibold mb-2">학습지 업로드</h3>
                <p className="text-[#6B6762] text-sm mb-4">
                  이미지 파일을 드래그하거나 클릭하여 선택하세요
                </p>
                <input
                  type="file"
                  accept="image/*"
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
                {progress < 100 ? (
                  <>
                    <Loader2 className="h-16 w-16 text-[#C9B59C] mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold mb-2">파일 업로드 중...</h3>
                    <p className="text-[#6B6762] text-sm mb-6">
                      {file?.name}
                    </p>
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
                  </>
                ) : (
                  <>
                    <div className="inline-block p-4 bg-[#C9B59C]/10 rounded-full mb-4">
                      <Check className="h-16 w-16 text-[#C9B59C]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">업로드 완료!</h3>
                    <p className="text-[#6B6762] text-sm">
                      문서 상세 페이지로 이동합니다...
                    </p>
                  </>
                )}
              </div>
            )}
          </HistoryCard>
        </motion.div>
      </div>
    </div>
  );
}
