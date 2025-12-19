import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { cardId, content } = await req.json();

    if (!cardId || !content) {
      return NextResponse.json(
        { error: "cardId와 content가 필요합니다." },
        { status: 400 }
      );
    }

    // Gemini API로 퀴즈 생성
    const questions = await generateQuiz(content);
    
    console.log(`생성된 문제 수: ${questions.length}`);
    
    // 정확히 5개만 사용 (혹시 모를 경우 대비)
    const limitedQuestions = questions.slice(0, 5);
    
    console.log(`저장할 문제 수: ${limitedQuestions.length}`);
    console.log('문제 타입:', limitedQuestions.map((q: any) => q.type));

    // 현재 로그인한 사용자 정보 가져오기 (필요 시)
    // 여기서는 user_id를 null로 설정 (옵션)

    // Supabase에 퀴즈 저장 (table.md 스키마에 맞춤)
    const { data, error } = await supabase
      .from("quiz")
      .insert(
        limitedQuestions.map((q: any) => ({
          card_id: cardId,
          title: q.type || "단답형",
          content: q.question,
          options: q.options || null, // 객관식일 경우 options 포함
          correct_answer: q.correctAnswer,
          score: 10, // 기본 점수
        }))
      )
      .select();
    
    console.log(`실제 저장된 문제 수: ${data?.length || 0}`);

    // cards 테이블의 isQuiz를 true로 업데이트
    const { error: updateError } = await supabase
      .from("cards")
      .update({ isQuiz: true })
      .eq("id", cardId);

    if (updateError) {
      console.error("cards 업데이트 오류:", updateError);
    }

    if (error) {
      console.error("Supabase 저장 오류:", error);
      return NextResponse.json(
        { error: "퀴즈 저장에 실패했습니다.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: limitedQuestions.length,
      quizzes: data,
    });
  } catch (error: any) {
    console.error("퀴즈 생성 오류:", error);
    return NextResponse.json(
      { error: "퀴즈 생성에 실패했습니다.", details: error.message },
      { status: 500 }
    );
  }
}
