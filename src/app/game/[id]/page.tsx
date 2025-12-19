"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, use } from "react";
import { ArrowLeft, ArrowRight, Check, X, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { HistoryCard } from "@/components/HistoryCard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Quiz {
  id: string;
  title: string;
  content: string;
  options?: string[]; // 객관식일 경우
  correct_answer: string;
  score: number;
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data, error } = await supabase
          .from("quiz")
          .select("*")
          .eq("card_id", id);

        if (error) throw error;

        if (data && data.length > 0) {
          setQuizzes(data);
        }
      } catch (err: any) {
        console.error("퀴즈 데이터 로딩 오류:", err);
        toast.error("퀴즈 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [id]);

  const currentQuiz = quizzes[currentIndex];

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      toast.error("답을 선택해주세요!");
      return;
    }

    let isCorrect = false;
    
    // 객관식일 경우 숫자 비교, 단답형일 경우 텍스트 비교
    if (currentQuiz.options && currentQuiz.options.length > 0) {
      // 객관식: userAnswer가 "1", "2", "3", "4" 형태
      isCorrect = userAnswer === currentQuiz.correct_answer;
    } else {
      // 단답형: 텍스트 비교
      isCorrect = userAnswer.trim().toLowerCase() === currentQuiz.correct_answer.toLowerCase();
    }
    
    setShowExplanation(true);
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = isCorrect;
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + currentQuiz.score);
      toast.success("정답입니다! 🎉");
    } else {
      toast.error("아쉬워요! 다시 한 번 생각해보세요.");
    }
  };

  const handleNext = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowExplanation(false);
    } else {
      // 마지막 문제
      setIsFinished(true);
      if (score / quizzes.length >= 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9B59C', '#DAD0C7', '#EFE9E3']
        });
      }
      saveScore();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserAnswer("");
      setShowExplanation(false);
    }
  };

  const saveScore = async () => {
    try {
      // 로컬스토리지에서 사용자 정보 가져오기
      const authToken = localStorage.getItem('sb-yfbxdujtplybaftbbmel-auth-token');
      if (!authToken) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const authData = JSON.parse(authToken);
      const userId = authData.user?.id;

      if (!userId) {
        toast.error("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // 각 퀴즈 결과를 game_records에 저장
      const records = quizzes.map((quiz, index) => ({
        user_id: userId,
        quiz_id: quiz.id,
        is_correct: answers[index] || false,
      }));

      const { error } = await supabase
        .from("game_records")
        .insert(records);

      if (error) throw error;

      toast.success("점수가 저장되었습니다!");
    } catch (err: any) {
      console.error("점수 저장 오류:", err);
      toast.error("점수 저장에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <HistoryCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">퀴즈를 불러오는 중...</h2>
          <p className="text-[#6B6762]">잠시만 기다려주세요.</p>
        </HistoryCard>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <HistoryCard className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">퀴즈가 없습니다</h2>
          <p className="text-[#6B6762] mb-6">
            아직 생성된 퀴즈가 없습니다.
          </p>
          <SecondaryButton onClick={() => router.push(`/set/${id}`)}>
            문서로 돌아가기
          </SecondaryButton>
        </HistoryCard>
      </div>
    );
  }

  if (isFinished) {
    const totalScore = quizzes.reduce((sum, q) => sum + q.score, 0);
    const percentage = Math.round((score / totalScore) * 100);
    
    return (
      <div className="min-h-screen bg-[#F9F8F6] py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HistoryCard className="text-center">
              <div className="text-6xl mb-4">
                {percentage >= 90 ? "🏆" : percentage >= 70 ? "🎉" : percentage >= 50 ? "👏" : "💪"}
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {percentage >= 90 ? "완벽해요!" : percentage >= 70 ? "잘했어요!" : percentage >= 50 ? "괜찮아요!" : "다시 도전!"}
              </h1>
              <div className="text-6xl font-bold text-[#C9B59C] mb-2">
                {score}/{totalScore}점
              </div>
              <p className="text-[#6B6762] mb-8">
                정답률: {percentage}%
              </p>

              {/* 문제별 결과 */}
              <div className="mb-8 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-5 gap-2">
                  {answers.map((isCorrect, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-center justify-center ${
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <span className="font-medium">{index + 1}</span>
                      {isCorrect ? (
                        <Check className="h-4 w-4 text-green-600 ml-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-600 ml-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SecondaryButton onClick={() => window.location.reload()}>
                  다시 풀기
                </SecondaryButton>
                <PrimaryButton onClick={() => router.push(`/rank/${id}`)}>
                  랭킹 보기
                </PrimaryButton>
              </div>
            </HistoryCard>
          </motion.div>
        </div>
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
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => router.push(`/set/${id}`)}
              className="flex items-center gap-2 text-[#6B6762] hover:text-[#2D2A26] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>뒤로가기</span>
            </button>
            <div className="text-[#6B6762]">
              {currentIndex + 1} / {quizzes.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full h-2 bg-[#EFE9E3] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#C9B59C]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HistoryCard className="mb-6">
                {/* Quiz Title Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#EFE9E3] text-[#6B6762] rounded-full text-sm">
                    {currentQuiz.title}
                  </span>
                </div>

                {/* Question */}
                <h2 className="text-2xl font-bold mb-6">{currentQuiz.content}</h2>

                {/* Answer Input - 객관식 또는 단답형 */}
                <div className="mb-6">
                  {currentQuiz.options && currentQuiz.options.length > 0 ? (
                    // 객관식
                    <div className="space-y-3">
                      {currentQuiz.options.map((option, index) => {
                        const optionNumber = (index + 1).toString();
                        const isSelected = userAnswer === optionNumber;
                        const isCorrect = currentQuiz.correct_answer === optionNumber;
                        const showCorrect = showExplanation && isCorrect;
                        const showWrong = showExplanation && isSelected && !isCorrect;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => !showExplanation && setUserAnswer(optionNumber)}
                            disabled={showExplanation}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              showCorrect
                                ? "bg-green-50 border-green-500"
                                : showWrong
                                ? "bg-red-50 border-red-500"
                                : isSelected
                                ? "bg-[#C9B59C]/10 border-[#C9B59C]"
                                : "border-[#EFE9E3] hover:border-[#C9B59C] hover:bg-[#EFE9E3]"
                            } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                  showCorrect
                                    ? "bg-green-500 text-white"
                                    : showWrong
                                    ? "bg-red-500 text-white"
                                    : isSelected
                                    ? "bg-[#C9B59C] text-white"
                                    : "bg-[#EFE9E3] text-[#6B6762]"
                                }`}>
                                  {optionNumber}
                                </span>
                                <span className={showCorrect ? "text-green-700 font-medium" : showWrong ? "text-red-700" : ""}>
                                  {option}
                                </span>
                              </div>
                              {showCorrect && <Check className="h-5 w-5 text-green-600" />}
                              {showWrong && <X className="h-5 w-5 text-red-600" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // 단답형
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={showExplanation}
                      placeholder="답을 입력하세요"
                      className="w-full p-4 rounded-lg border-2 border-[#EFE9E3] focus:border-[#C9B59C] focus:outline-none text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !showExplanation) {
                          handleSubmit();
                        }
                      }}
                    />
                  )}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`p-4 rounded-lg ${
                      answers[currentIndex] 
                        ? "bg-green-50 border-2 border-green-200" 
                        : "bg-red-50 border-2 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {answers[currentIndex] ? (
                        <>
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-600">정답입니다! 🎉</span>
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-600">아쉬워요!</span>
                        </>
                      )}
                    </div>
                    <p className="text-[#6B6762]">
                      <span className="font-medium">정답:</span>{" "}
                      {currentQuiz.options && currentQuiz.options.length > 0
                        ? `${currentQuiz.correct_answer}번 - ${currentQuiz.options[parseInt(currentQuiz.correct_answer) - 1]}`
                        : currentQuiz.correct_answer}
                    </p>
                  </motion.div>
                )}
              </HistoryCard>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <SecondaryButton
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  이전
                </SecondaryButton>
                
                {!showExplanation ? (
                  <PrimaryButton onClick={handleSubmit} className="flex-1">
                    제출하기
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={handleNext} className="flex-1">
                    {currentIndex < quizzes.length - 1 ? (
                      <>
                        다음
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    ) : (
                      <>
                        결과 보기
                        <Trophy className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </PrimaryButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Score Display */}
          <div className="mt-6 text-center">
            <span className="text-[#6B6762]">
              현재 점수: <span className="text-[#C9B59C] font-semibold">{score}</span> / {currentIndex + (showExplanation ? 1 : 0)}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
