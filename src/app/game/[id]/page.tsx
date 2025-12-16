"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, use } from "react";
import { Timer, Trophy, ArrowUp, ArrowDown, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { HistoryCard } from "@/components/HistoryCard";
import confetti from "canvas-confetti";

interface Question {
  id: number;
  type: "order" | "next" | "result" | "people" | "significance" | "cause";
  question: string;
  options: string[];
  answer: number | number[];
  explanation: string;
}

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      type: "order",
      question: "다음 사건들을 시간 순서대로 배열하세요",
      options: ["훈민정음 창제", "조선 건국", "과전법 실시", "한양 천도"],
      answer: [2, 1, 3, 0],
      explanation: "조선 건국(1392) → 과전법 실시(1391은 오류, 실제로는 건국 후) → 한양 천도(1394) → 훈민정음 창제(1443) 순서입니다."
    },
    {
      id: 2,
      type: "next",
      question: "위화도 회군 이후 일어난 사건은?",
      options: ["조선 건국", "고려 건국", "몽골 침입", "임진왜란"],
      answer: 0,
      explanation: "위화도 회군(1388) 이후 이성계가 정권을 장악하고 1392년 조선을 건국했습니다."
    },
    {
      id: 3,
      type: "result",
      question: "과전법 실시의 결과로 옳은 것은?",
      options: [
        "국가 재정이 안정되었다",
        "불교가 융성했다",
        "과거제가 폐지되었다",
        "신분제가 없어졌다"
      ],
      answer: 0,
      explanation: "과전법은 토지 제도를 개혁하여 국가 재정을 안정시키고 신진 사대부의 경제 기반을 마련했습니다."
    },
    {
      id: 4,
      type: "people",
      question: "조선 건국과 관련된 인물은?",
      options: ["왕건", "정도전", "을지문덕", "김유신"],
      answer: 1,
      explanation: "정도전은 이성계를 도와 조선 건국에 큰 역할을 한 개국공신입니다."
    },
    {
      id: 5,
      type: "significance",
      question: "훈민정음 창제의 의의는?",
      options: [
        "독자적인 문자 체계 확립",
        "불교 경전 번역",
        "한자 사용 확대",
        "일본과의 교류 증진"
      ],
      answer: 0,
      explanation: "훈민정음은 우리나라 고유의 문자를 만들어 문화적 독창성을 확립했습니다."
    },
  ];

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (questions[currentIndex]?.type === "order") {
      setOrderItems([...questions[currentIndex].options]);
    }
  }, [currentIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...orderItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setOrderItems(newItems);
  };

  const checkAnswer = () => {
    let correct = false;

    if (currentQuestion.type === "order") {
      const userOrder = orderItems.map(item => 
        currentQuestion.options.indexOf(item)
      );
      correct = JSON.stringify(userOrder) === JSON.stringify(currentQuestion.answer);
    } else {
      correct = selectedAnswer === currentQuestion.answer;
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = 100;
      setScore(score + points);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C9B59C', '#DAD0C7']
      });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      setIsComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9B59C', '#DAD0C7', '#EFE9E3']
      });
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      order: "📊",
      next: "🔮",
      result: "🎯",
      people: "👥",
      significance: "💡",
      cause: "🔍"
    };
    return icons[type] || "❓";
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: "순서 맞추기",
      next: "다음 사건",
      result: "결과 선택",
      people: "인물 연결",
      significance: "의의 파악",
      cause: "원인 추론"
    };
    return labels[type] || "문제";
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <HistoryCard className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold mb-2">완료!</h1>
            <p className="text-[#6B6762] mb-6">
              모든 문제를 풀었어요!
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-[#EFE9E3] rounded-lg">
                <p className="text-sm text-[#6B6762] mb-1">점수</p>
                <p className="text-2xl font-bold text-[#C9B59C]">{score}점</p>
              </div>
              <div className="p-4 bg-[#EFE9E3] rounded-lg">
                <p className="text-sm text-[#6B6762] mb-1">시간</p>
                <p className="text-2xl font-bold text-[#C9B59C]">{formatTime(timer)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <PrimaryButton onClick={() => router.push(`/rank/${id}`)}>
                랭킹 보기
              </PrimaryButton>
              <SecondaryButton onClick={() => window.location.reload()}>
                다시 풀기
              </SecondaryButton>
            </div>
          </HistoryCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stats Bar */}
          <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg border border-[#EFE9E3]">
            <div className="flex items-center gap-2 text-[#6B6762]">
              <Timer className="h-5 w-5" />
              <span className="font-medium">{formatTime(timer)}</span>
            </div>
            <div className="text-[#6B6762]">
              <span className="font-medium text-[#C9B59C]">{currentIndex + 1}</span>
              <span> / {questions.length}</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B6762]">
              <Trophy className="h-5 w-5" />
              <span className="font-medium text-[#C9B59C]">{score}점</span>
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HistoryCard>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{getQuestionTypeIcon(currentQuestion.type)}</span>
                    <span className="px-3 py-1 bg-[#EFE9E3] rounded-full text-sm text-[#6B6762]">
                      {getQuestionTypeLabel(currentQuestion.type)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
                </div>

                {/* Order Type Question */}
                {currentQuestion.type === "order" && (
                  <div className="space-y-3">
                    {orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-[#EFE9E3] rounded-lg"
                      >
                        <span className="flex-shrink-0 w-8 h-8 bg-[#C9B59C] text-white rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="flex-1">{item}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveItem(index, "up")}
                            disabled={index === 0 || showResult}
                            className="p-2 bg-white rounded-lg hover:bg-[#DAD0C7] transition-colors disabled:opacity-30"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveItem(index, "down")}
                            disabled={index === orderItems.length - 1 || showResult}
                            className="p-2 bg-white rounded-lg hover:bg-[#DAD0C7] transition-colors disabled:opacity-30"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Multiple Choice Questions */}
                {currentQuestion.type !== "order" && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => !showResult && setSelectedAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswer === index
                            ? "border-[#C9B59C] bg-[#C9B59C]/5"
                            : "border-[#EFE9E3] bg-[#EFE9E3] hover:border-[#DAD0C7]"
                        } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Submit/Next Button */}
                {!showResult ? (
                  <div className="mt-6">
                    <PrimaryButton
                      onClick={checkAnswer}
                      disabled={
                        currentQuestion.type === "order" 
                          ? false 
                          : selectedAnswer === null
                      }
                      className="w-full"
                    >
                      제출하기
                    </PrimaryButton>
                  </div>
                ) : (
                  <>
                    {/* Result */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 p-4 rounded-lg ${
                        isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <>
                            <Check className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-600">정답입니다! 🎉</span>
                          </>
                        ) : (
                          <>
                            <X className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-600">아쉬워요!</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-[#6B6762]">{currentQuestion.explanation}</p>
                    </motion.div>

                    <div className="mt-6">
                      <PrimaryButton onClick={nextQuestion} className="w-full">
                        {currentIndex < questions.length - 1 ? "다음 문제" : "결과 보기"}
                      </PrimaryButton>
                    </div>
                  </>
                )}
              </HistoryCard>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
