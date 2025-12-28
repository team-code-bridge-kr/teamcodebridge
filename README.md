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
│   ├── page.tsx         # 메인 페이지
│   └── about/
│       └── page.tsx     # About 페이지
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

## About 페이지 DOM 구조

`app/about/page.tsx`의 DOM 구조는 다음과 같이 구성되어 있습니다:

```
<main>
  ├── <Navigation />                    # 상단 네비게이션 바
  │
  ├── <section> (Hero Section)          # 히어로 섹션
  │   └── <div> (max-w-6xl container)
  │       └── <div> (grid lg:grid-cols-2)
  │           ├── 텍스트 콘텐츠 (제목, 설명, 태그)
  │           └── 이미지 카드
  │
  ├── <section> (Content Sections)      # 메인 콘텐츠 섹션
  │   └── <div> (max-w-6xl container)
  │       │
  │       ├── Section 1: TeamCodeBridge란?
  │       │   ├── 헤더 (아이콘 + 제목)
  │       │   └── 연합 동아리 소개 박스
  │       │       ├── 텍스트 설명
  │       │       └── 대학 로고 무한 스크롤 (animate-marquee)
  │       │
  │       ├── 미션/비전 카드 그리드 (md:grid-cols-2)
  │       │   ├── 미션 카드
  │       │   └── 비전 카드
  │       │
  │       ├── Section 1.5: 고민 섹션
  │       │   ├── 헤더 (아이콘 + 제목)
  │       │   ├── 고민 무한 스크롤 (animate-marquee-slow)
  │       │   │   └── 고민 카드들 (2세트로 무한 스크롤)
  │       │   └── OUR STORY 섹션 (md:grid-cols-2)
  │       │       ├── 텍스트 콘텐츠
  │       │       └── 이미지
  │       │
  │       ├── 문제의식 섹션
  │       │   ├── 헤더 (아이콘 + 제목)
  │       │   └── 기존 교육의 한계 카드뷰 (md:grid-cols-3)
  │       │       ├── 정규 행사 카드
  │       │       ├── 사설 학원 카드
  │       │       └── 대학 프로젝트 카드
  │       │
  │       ├── 전환점 섹션
  │       │   └── 배경 그라데이션 박스
  │       │       ├── 헤더 (아이콘 + 제목)
  │       │       └── 변화 카드 그리드 (sm:grid-cols-3)
  │       │           ├── 강의 → 프로젝트 중심
  │       │           ├── 혼자 → 멘토와 팀
  │       │           └── 이론 → 결과물
  │       │
  │       ├── 우리가 만들어온 방식 섹션
  │       │   ├── 헤더 (아이콘 + 제목)
  │       │   ├── 타임라인 리스트 (<ol>)
  │       │   │   ├── 문제의식 (번호 1)
  │       │   │   ├── 선배 멘토링 (번호 2)
  │       │   │   ├── 프로젝트 중심 (번호 3)
  │       │   │   └── 미니 해커톤 (번호 4)
  │       │   └── 실행 모델 카드 (sm:grid-cols-3)
  │       │       ├── 교육 철학
  │       │       ├── 학습 방식
  │       │       └── 성장의 기준
  │       │
  │       └── 핵심 가치 섹션
  │           ├── 헤더 (아이콘 + 제목)
  │           └── 가치 카드 그리드 (sm:grid-cols-2 md:grid-cols-3)
  │               ├── 생각 확장
  │               ├── 기술 성장
  │               └── 결과 창출
  │
  ├── <section> (지금의 TeamCodeBridge)  # 현재 상태 섹션
  │   └── <div> (max-w-6xl container)
  │       ├── 헤더 (아이콘 + 제목)
  │       ├── 통계 카드 그리드 (md:grid-cols-3)
  │       └── 미래 비전 박스
  │
  ├── <section> (CTA Section)            # 행동 유도 섹션
  │   └── <div> (max-w-4xl container)
  │       ├── 이미지
  │       ├── 제목
  │       ├── 설명
  │       └── 지원하기 버튼
  │
  └── <Footer />                        # 하단 푸터
```

### 주요 구조 특징

1. **반응형 디자인**
   - 모든 섹션은 `max-w-6xl mx-auto` 컨테이너로 중앙 정렬
   - 모바일: `px-4`, 태블릿: `sm:px-6`
   - 그리드 레이아웃: 모바일 1열 → 태블릿 2열 → 데스크톱 3열

2. **섹션 헤더 통일**
   - 모든 섹션 헤더는 동일한 구조:
     ```tsx
     <div className="flex items-center gap-3 sm:gap-4">
       <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
         <span>아이콘</span>
       </div>
       <h2>제목</h2>
     </div>
     ```

3. **애니메이션**
   - 대학 로고 스크롤: `animate-marquee` (40초)
   - 고민 카드 스크롤: `animate-marquee-slow` (60초)
   - 호버 효과: `hover:shadow-xl`, `hover:-translate-y-1`

4. **접근성**
   - 모든 이미지에 `alt` 속성 제공
   - 버튼 최소 터치 영역: `min-h-[44px]`
   - 의미론적 HTML 태그 사용 (`<main>`, `<section>`, `<h1>`~`<h3>`)

5. **모바일 최적화**
   - 텍스트 크기: `text-xs sm:text-sm md:text-base lg:text-lg`
   - 간격: `gap-3 sm:gap-4 md:gap-6`
   - 패딩: `p-5 sm:p-6 md:p-8 lg:p-10`
   - 아이콘 크기: `w-10 h-10 sm:w-12 sm:h-12`

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

