# 히스토리 - AI 기반 역사 학습 플랫폼

역사 자료를 기반으로 AI가 퀴즈를 자동 생성하고, 흐름도를 통해 역사적 사건을 학습할 수 있는 플랫폼입니다.

## 주요 기능

### 1. 📝 문제 생성 (`/data/:id/makeCard`)
- OCR로 변환한 수업자료를 기반으로 AI가 문제를 자동 생성
- Google Gemini API를 활용한 지능형 퀴즈 생성
- 6가지 유형의 문제 (순서 맞추기, 다음 사건, 결과 선택, 인물 연결, 의의 파악, 원인 추론)
- 각 유형별 5문제씩 총 30문제 자동 생성

### 2. 🌊 흐름도 확인 (`/set/:id/flow`)
- Supabase flow 테이블에서 역사적 사건의 흐름을 불러와 시각화
- 사건별 상세 정보 (날짜, 설명, 원인, 결과, 관련 인물, 의의) 제공
- 줌 인/아웃 및 전체보기 기능
- 사건 클릭으로 상세 정보 모달 표시

### 3. 📚 문제 불러오기 & 풀기 (`/quiz/:id`)
- Supabase quizzes 테이블에서 생성된 문제 불러오기
- 인터랙티브한 퀴즈 풀이 UI
- 실시간 정답 체크 및 해설 표시
- 진행 상황 추적 및 점수 계산
- 문제 풀이 완료 후 결과 화면 표시

### 4. 🏆 랭킹 확인 (`/rank/:id`)
- Supabase rankings 테이블에서 사용자별 랭킹 데이터 불러오기
- 사용자별 최고 점수 기준 랭킹 표시
- 내 최고 점수 및 플레이 횟수 통계
- 실시간 랭킹 업데이트

## 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Tailwind CSS, Framer Motion, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Auth**: Supabase Auth

## 설치 및 실행

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Supabase 테이블 구조

프로젝트에서 사용하는 주요 테이블:

#### documents
```sql
create table documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  thumbnail text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);
```

#### flow
```sql
create table flow (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id),
  title text not null,
  date text,
  description text not null,
  cause text,
  result text,
  people text[],
  significance text,
  sequence integer,
  created_at timestamp with time zone default now()
);
```

#### quizzes
```sql
create table quizzes (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id),
  type text not null,
  question text not null,
  options text[] not null,
  correct_answer integer not null,
  explanation text,
  created_at timestamp with time zone default now()
);
```

#### rankings
```sql
create table rankings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  document_id uuid references documents(id),
  score integer not null,
  total integer not null,
  percentage integer not null,
  created_at timestamp with time zone default now()
);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## API 엔드포인트

### POST `/api/generate-quiz`
역사 자료를 기반으로 AI 퀴즈를 생성합니다.

**Request Body:**
```json
{
  "documentId": "uuid",
  "content": "역사 자료 내용"
}
```

**Response:**
```json
{
  "success": true,
  "count": 30,
  "quizzes": [...]
}
```

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── generate-quiz/     # AI 퀴즈 생성 API
│   ├── data/
│   │   └── [id]/
│   │       └── makeCard/       # 문제 생성 페이지
│   ├── set/
│   │   └── [id]/
│   │       └── flow/           # 흐름도 페이지
│   ├── quiz/
│   │   └── [id]/               # 퀴즈 풀이 페이지
│   └── rank/
│       └── [id]/               # 랭킹 페이지
├── components/                  # 재사용 가능한 컴포넌트
└── lib/
    ├── supabase.ts             # Supabase 클라이언트
    └── gemini.ts               # Gemini AI 클라이언트
```

## 라이선스

MIT

## 기여

기여는 언제나 환영합니다! Pull Request를 보내주세요.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
