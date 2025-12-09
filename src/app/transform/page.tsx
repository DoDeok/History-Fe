"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { HistoryCard } from "@/components/HistoryCard";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function TransformPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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
              {file && (
                <p className="mt-4 text-sm text-[#6B6762]">
                  선택된 파일: {file.name}
                </p>
              )}
            </div>
          </HistoryCard>
        </motion.div>
      </div>
    </div>
  );
}
