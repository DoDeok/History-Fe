import { NextRequest, NextResponse } from "next/server";
import { visionModel } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    // visionModel 체크
    if (!visionModel) {
      return NextResponse.json(
        { error: "Gemini API가 설정되지 않았습니다. GEMINI_API_KEY를 확인하세요." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 필요합니다." },
        { status: 400 }
      );
    }

    // 지원하는 파일 형식 확인
    const supportedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf"
    ];

    if (!supportedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "지원하지 않는 파일 형식입니다. JPEG, PNG, GIF, WebP, PDF만 지원합니다." },
        { status: 400 }
      );
    }

    // 파일을 base64로 변환
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // MIME 타입 결정
    const mimeType = file.type;

    // Gemini에 이미지/PDF 전송하여 OCR 수행
    const prompt = `이 이미지/문서에서 모든 텍스트를 추출해주세요. 
    
다음 규칙을 따라주세요:
1. 문서의 구조를 최대한 유지하면서 텍스트를 추출해주세요.
2. 제목, 소제목, 본문 등의 구분을 유지해주세요.
3. 표가 있다면 적절한 형식으로 변환해주세요.
4. 번호가 매겨진 목록이나 글머리 기호가 있다면 유지해주세요.
5. 역사 관련 내용이라면 날짜, 사건명, 인물명 등을 정확하게 추출해주세요.
6. 불명확한 텍스트는 [불명확] 표시를 해주세요.

추출된 텍스트만 반환하고, 다른 설명은 하지 마세요.`;

    const result = await visionModel.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64
        }
      },
      prompt
    ]);

    const response = await result.response;
    const extractedText = response.text();

    // 문서 제목 추출 시도 (첫 번째 줄 또는 가장 큰 텍스트)
    const lines = extractedText.split("\n").filter((line: string) => line.trim());
    const suggestedTitle = lines[0]?.substring(0, 100) || "무제";

    return NextResponse.json({
      success: true,
      content: extractedText,
      suggestedTitle: suggestedTitle,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

  } catch (error: any) {
    console.error("OCR 처리 오류:", error);
    return NextResponse.json(
      { error: `OCR 처리 중 오류가 발생했습니다: ${error?.message || '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}
