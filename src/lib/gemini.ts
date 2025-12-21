import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Gemini 2.5 모델 사용
export const model = genAI?.getGenerativeModel({ 
  model: "gemini-2.5-flash" 
}) || null;

// Vision 기능을 위한 모델 (OCR 등)
export const visionModel = genAI?.getGenerativeModel({ 
  model: "gemini-2.5-flash" 
}) || null;

export async function generateQuiz(content: string) {
  const prompt = `다음 역사 자료를 분석하여 퀴즈를 생성하세요.

자료 내용:
${content}

**중요: 정확히 5개의 문제만 생성하세요**

문제 구성:
- 1번 문제: 객관식 (4개 선택지)
- 2번 문제: 객관식 (4개 선택지)
- 3번 문제: 객관식 (4개 선택지)
- 4번 문제: 객관식 (4개 선택지)
- 5번 문제: 단답형 (선택지 없음)

객관식 문제 형식:
- type: "객관식"
- question: 질문 내용
- options: ["선택지1", "선택지2", "선택지3", "선택지4"]
- correctAnswer: 정답 번호 ("1", "2", "3", "4" 중 하나)

단답형 문제 형식:
- type: "단답형"
- question: 질문 내용
- correctAnswer: 정답 텍스트

JSON 배열로 정확히 5개만 반환:
[
  {
    "type": "객관식",
    "question": "6월 민주 항쟁이 본격화된 날짜는?",
    "options": ["1987년 5월 10일", "1987년 6월 10일", "1987년 6월 29일", "1987년 7월 10일"],
    "correctAnswer": "2"
  },
  {
    "type": "객관식",
    "question": "전두환 정권이 직선제 개헌 논의를 금지한 조치는?",
    "options": ["계엄령", "호헌 조치", "긴급조치", "비상계엄"],
    "correctAnswer": "2"
  },
  {
    "type": "객관식",
    "question": "박종철 고문 사건의 진상을 밝힌 사람은?",
    "options": ["이한열", "김대중", "김명윤 신부", "노태우"],
    "correctAnswer": "3"
  },
  {
    "type": "객관식",
    "question": "6.29 선언을 통해 직선제 개헌을 수용한 인물은?",
    "options": ["전두환", "노태우", "김영삼", "김대중"],
    "correctAnswer": "2"
  },
  {
    "type": "단답형",
    "question": "경찰의 최루탄에 피격되어 뇌사 상태가 된 대학생의 이름은?",
    "correctAnswer": "이한열"
  }
]

**반드시 지켜야 할 규칙:**
1. 정확히 5개의 문제만 생성 (더 많이 생성하지 말 것)
2. 처음 4개는 반드시 객관식 (options 배열 포함)
3. 마지막 1개는 반드시 단답형 (options 없음)
4. JSON 배열만 반환, 다른 텍스트 포함 금지`;

  try {
    if (!model) {
      throw new Error("Gemini API가 설정되지 않았습니다.");
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON 추출 (마크다운 코드 블록이 있을 경우 제거)
    let jsonText = text;
    if (text.includes("```json")) {
      jsonText = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      jsonText = text.split("```")[1].split("```")[0].trim();
    }
    
    const questions = JSON.parse(jsonText);
    
    // 혹시 모를 경우를 대비해 5개만 사용하되, 객관식 4개 + 단답형 1개 확인
    const limitedQuestions = questions.slice(0, 5);
    
    console.log(`퀴즈 생성 완료: ${limitedQuestions.length}개 문제 생성`);
    console.log('문제 타입:', limitedQuestions.map((q: any) => q.type));
    
    return limitedQuestions;
  } catch (error) {
    console.error("퀴즈 생성 오류:", error);
    throw error;
  }
}
