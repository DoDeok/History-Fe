import { NextRequest, NextResponse } from "next/server";
import { generateFlow } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, content, userId } = body;

    if (!cardId || !content) {
      return NextResponse.json(
        { error: "cardId와 content가 필요합니다." },
        { status: 400 }
      );
    }

    // 기존 flow 데이터가 있는지 확인
    const { data: existingFlow } = await supabase
      .from("flow")
      .select("id")
      .eq("card_id", cardId);

    if (existingFlow && existingFlow.length > 0) {
      // 기존 데이터 삭제
      await supabase.from("flow").delete().eq("card_id", cardId);
    }

    // Gemini로 흐름도 생성
    const flowNodes = await generateFlow(content);

    // Supabase에 저장
    const flowData = flowNodes.map((node: any, index: number) => ({
      card_id: cardId,
      flow: "main",
      node_order: index + 1,
      title: node.title,
      content: node.content,
      date: node.date,
      cause: node.cause,
      result: node.result,
      people: node.people || [],
      significance: node.significance,
    }));

    const { data, error } = await supabase
      .from("flow")
      .insert(flowData)
      .select();

    if (error) {
      console.error("Flow 저장 오류:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "흐름도가 생성되었습니다.",
      flowCount: flowNodes.length,
      data: data,
    });

  } catch (error: any) {
    console.error("Flow 생성 오류:", error);
    return NextResponse.json(
      { error: `흐름도 생성 중 오류가 발생했습니다: ${error?.message || '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}
