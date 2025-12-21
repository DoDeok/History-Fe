# Authentication System PRD

## 1. 개요
프로젝트 'history'의 보안 및 사용자 환경 개선을 위해 **Session 인증 & JWT** 기반의 인증 시스템을 도입하고, **Zustand**를 통해 전역 인증 상태를 관리합니다. 기존의 GitHub OAuth를 통합하고, 신규 로컬 로그인/회원가입 기능을 추가합니다.

## 2. 주요 요구사항
- **Session & JWT 인증**: 서버 측에서 JWT를 생성하고 세션을 관리하여 보안 강화.
- **Zustand 상태 관리**: 클라이언트 애플리케이션 전체에서 일관된 로그인 상태 유지.
- **GitHub OAuth 통합**: 기존 구현된 GitHub 소셜 로그인을 새로운 인증 체계에 통합.
- **로컬 로그인 & 회원가입**: 이메일 및 비밀번호를 이용한 직접 가입 및 로그인 기능 제공.

## 3. 상세 설계

### 3.1. 인증 메커니즘 (JWT & Session)
- **발급**: 로컬 로그인 성공 또는 소셜 로그인 리디렉션 시 Access Token(JWT) 및 Refresh Token 발급.
- **저장**: 
  - 인증 토큰은 보안을 위해 `HttpOnly` 쿠키에 저장하여 XSS 공격 방지.
  - 클라이언트 측 만료 정보는 Zustand 및 LocalStorage(비보안 정보만)에 동기화.
- **검증**: 모든 API 요청 시 미들웨어 또는 고차 함구(HOC)에서 JWT 유효성 검사.

### 3.2. Zustand 상태 트리 (useAuthStore)
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
  setAuth: (user: User) => void;
}
```
- 앱 초기 로드 시 세션 확인 후 상태 복원.
- 로그인/로그아웃 시 전역 상태 업데이트 및 UI 즉각 반응.

### 3.3. 회원가입 및 로그인 흐름
1. **회원가입 (Local)**:
   - 이메일, 비밀번호(해싱 저장), 사용자명 입력.
   - DB(`users` 테이블)에 계정 생성.
2. **로그인 (Local)**:
   - 이메일/비밀번호 검증.
   - 성공 시 JWT 발급 및 쿠키 설정.
3. **GitHub OAuth**:
   - OAuth 성공 후 콜백 페이지에서 서버 측 JWT 발급 단계 추가.
   - 기존의 `src/app/auth/page.tsx` 로직을 새로운 JWT 발급 흐름으로 고도화.

## 4. 데이터베이스 변경 사항
- `users` 테이블 강화 (필요 시 `refresh_token` 필드 추가).
- 비밀번호 저장을 위한 `password` 필드 활용 (현재 nullable).

## 5. 단계별 구현 계획
1. **1단계**: Zustand를 이용한 인증 스토어(`useAuthStore`) 생성 및 가짜 데이터 연동.
2. **2단계**: 서버 API 엔드포인트(`api/auth/login`, `api/auth/signup`) 및 JWT 발급 로직 구현.
3. **3단계**: 클라이언트 로그인/회원가입 페이지 기능 완성.
4. **4단계**: GitHub OAuth 콜백 수정 및 통합 테스트.
