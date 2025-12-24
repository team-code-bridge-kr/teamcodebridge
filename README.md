# TeamCodeBridge 홈페이지

TeamCodeBridge의 2026년도 홈페이지입니다. 새로운 멤버 리쿠루팅 및 동아리 홍보를 위한 웹사이트입니다.

## 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 기반 CSS
- **Framer Motion** - 애니메이션 라이브러리

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 프로젝트 구조

```
teamcodebridge/
├── app/
│   ├── globals.css      # 전역 스타일
│   ├── layout.tsx       # 루트 레이아웃
│   └── page.tsx         # 메인 페이지
├── components/
│   ├── Navigation.tsx   # 네비게이션 바
│   ├── Hero.tsx         # 히어로 섹션
│   ├── Statistics.tsx   # 통계 섹션
│   ├── Projects.tsx     # 프로젝트 갤러리
│   ├── Stories.tsx      # 뉴스/이야기 섹션
│   ├── Sponsors.tsx     # 후원사 섹션
│   ├── CTA.tsx          # 모집 CTA 섹션
│   └── Footer.tsx       # 푸터
└── public/              # 정적 파일
```

## 커스터마이징

### 통계 데이터 수정

`components/Statistics.tsx` 파일의 `stats` 배열을 수정하세요.

### 프로젝트 데이터 수정

`components/Projects.tsx` 파일의 `projects` 배열을 수정하세요.

### 뉴스/이야기 데이터 수정

이야기 섹션은 외부 콘텐츠 소스와 연동할 수 있습니다. 자세한 내용은 `STORY_INTEGRATION.md` 파일을 참고하세요.

**빠른 설정:**
1. `.env.local` 파일 생성
2. 원하는 소스 선택 (Notion, RSS, GitHub)
3. 환경 변수 설정
4. 개발 서버 재시작

### 후원사 데이터 수정

`components/Sponsors.tsx` 파일의 `sponsors` 배열을 수정하세요.

## 배포

Vercel, Netlify 등 Next.js를 지원하는 플랫폼에 배포할 수 있습니다.

### Vercel 배포

```bash
npm i -g vercel
vercel
```

## 라이선스

MIT

