# 이야기 섹션 외부 연동 가이드

TeamCodeBridge 홈페이지의 이야기 섹션을 외부 콘텐츠 소스와 연동하는 방법입니다.

## 지원하는 연동 방식

### 1. Notion API (추천) ⭐

**장점:**
- 무료로 사용 가능
- 사용하기 쉬움
- 실시간 업데이트
- 이미지, 카테고리 등 다양한 필드 지원

**설정 방법:**

1. **Notion 데이터베이스 생성**
   - Notion에서 새 페이지 생성
   - `/database` 입력하여 데이터베이스 생성
   - 다음 필드 추가:
     - `Title` (제목) - Title 타입
     - `Date` (날짜) - Date 타입
     - `Category` (카테고리) - Select 타입
     - `Image` (이미지) - Files 타입
     - `URL` (링크) - URL 타입 (선택)

2. **Notion Integration 생성**
   - https://www.notion.so/my-integrations 접속
   - "New integration" 클릭
   - 이름 입력 후 생성
   - "Internal Integration Token" 복사

3. **데이터베이스에 Integration 연결**
   - 생성한 데이터베이스 페이지 우측 상단 "..." 클릭
   - "Connections" → 생성한 Integration 선택

4. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   NOTION_API_KEY=your_integration_token
   NOTION_DATABASE_ID=your_database_id
   NEXT_PUBLIC_STORIES_SOURCE=notion
   ```
   
   - Database ID는 데이터베이스 URL에서 확인 가능
   - 예: `https://www.notion.so/abc123def456` → `abc123def456`

### 2. RSS 피드

**장점:**
- 대부분의 블로그 플랫폼 지원
- 설정이 간단

**지원하는 플랫폼:**
- 네이버 블로그 (RSS URL 필요)
- 티스토리
- Medium
- WordPress
- 기타 RSS 2.0 지원 블로그

**설정 방법:**

1. **RSS URL 확인**
   - 네이버 블로그: `https://blog.naver.com/rss/[블로그ID]`
   - 티스토리: `https://[블로그주소].tistory.com/rss`
   - Medium: `https://medium.com/feed/@[사용자명]`

2. **환경 변수 설정**
   ```bash
   RSS_FEED_URL=https://blog.naver.com/rss/your_blog_id
   NEXT_PUBLIC_STORIES_SOURCE=rss
   ```

### 3. GitHub Markdown 파일

**장점:**
- 버전 관리 가능
- 무료
- Markdown 형식으로 작성 가능

**설정 방법:**

1. **GitHub 저장소에 stories 폴더 생성**
   ```
   stories/
   ├── 2024-01-15-story-1.md
   ├── 2024-01-10-story-2.md
   └── ...
   ```

2. **Markdown 파일 형식**
   ```markdown
   ---
   title: "스토리 제목"
   date: "2024.01.15"
   category: "수상"
   ---
   
   스토리 내용...
   ```

3. **환경 변수 설정**
   ```bash
   GITHUB_REPO=username/repo-name
   GITHUB_TOKEN=your_github_token  # 선택사항 (공개 저장소는 불필요)
   NEXT_PUBLIC_STORIES_SOURCE=github
   ```

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 위의 설정을 추가하세요:

```bash
# .env.local
NEXT_PUBLIC_STORIES_SOURCE=notion
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx
```

## 테스트

설정 후 개발 서버를 재시작하고 `/api/stories` 엔드포인트를 확인하세요:

```bash
npm run dev
# 브라우저에서 http://localhost:3000/api/stories?source=notion 접속
```

## 캐싱

API는 1시간마다 캐시되며, 24시간 동안 stale-while-revalidate를 사용합니다.
실시간 업데이트가 필요하면 API 라우트의 캐시 설정을 수정하세요.

## 문제 해결

### Notion API 오류
- Integration이 데이터베이스에 연결되었는지 확인
- Database ID가 올바른지 확인
- API Key가 유효한지 확인

### RSS 피드 오류
- RSS URL이 올바른지 확인
- CORS 문제가 있을 수 있음 (프록시 사용 중)

### GitHub API 오류
- 저장소가 공개되어 있는지 확인
- 파일 경로가 올바른지 확인

