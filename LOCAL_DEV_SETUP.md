# 로컬 개발 환경 설정 가이드

## 빠른 시작

1. `.env.local` 파일 생성 (아래 참고)
2. `npm install` 실행
3. `npx prisma generate` 실행
4. `npm run dev` 실행
5. 브라우저에서 `http://localhost:3001` 접속

## 1. 환경 변수 설정

### `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Database - 서버 DB에 직접 연결
# ⚠️ 비밀번호는 서버 관리자에게 문의하세요
DATABASE_URL="postgresql://tcb_admin:비밀번호@175.123.252.36:5432/teamcodebridge?sslmode=require"

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth (서버의 .env 파일에서 복사)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Socket.io (로컬에서는 소켓 서버가 없어도 웹 앱은 동작)
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 서버의 환경 변수 가져오기

서버에서 환경 변수를 확인하려면:

```bash
# 서버에 SSH 접속 후
cat /root/teamcodebridge/.env | grep -E "DATABASE_URL|NEXTAUTH|GOOGLE"
```

⚠️ **보안**: 서버의 실제 비밀번호를 로컬에 복사할 때는 주의하세요!

### 중요: DATABASE_URL 설정

로컬에서 서버의 PostgreSQL 데이터베이스에 연결하려면:

1. **서버 DB 비밀번호 확인**: 서버 관리자에게 `tcb_admin` 사용자의 비밀번호를 확인하세요.

2. **연결 문자열 형식**:
   ```
   postgresql://[사용자명]:[비밀번호]@[서버IP]:[포트]/[데이터베이스명]?sslmode=require
   ```

3. **예시**:
   ```
   DATABASE_URL="postgresql://tcb_admin:비밀번호@175.123.252.36:5432/teamcodebridge?sslmode=require"
   ```

## 2. Prisma Client 생성

환경 변수를 설정한 후 Prisma Client를 재생성하세요:

```bash
npx prisma generate
```

## 3. 개발 서버 실행

```bash
npm run dev
```

서버는 `http://localhost:3001`에서 실행됩니다.

## 4. 문제 해결

### "Environment variable not found: DATABASE_URL" 오류

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확히 `.env.local`인지 확인 (`.env.local.txt` 아님)
- 서버를 재시작

### "Connection refused" 오류

- 서버의 PostgreSQL이 외부 연결을 허용하는지 확인
- 방화벽 설정 확인
- `sslmode=require` 옵션이 있는지 확인

### Prisma 스키마 변경 후 오류

- `npx prisma generate` 실행
- 개발 서버 재시작

## 5. 보안 주의사항

⚠️ **중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!
- `.gitignore`에 이미 포함되어 있어야 합니다
- 민감한 정보(비밀번호, API 키)가 포함되어 있습니다

