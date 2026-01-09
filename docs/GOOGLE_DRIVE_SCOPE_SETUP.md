# Google Drive API Scope 설정 가이드

## 오류: "Request had insufficient authentication scopes"

이 오류는 Google 계정이 Google Drive API에 접근할 권한이 없을 때 발생합니다.

## 해결 방법

### 방법 1: 로그아웃 후 재로그인 (가장 빠름)

1. 현재 로그인 상태를 완전히 로그아웃
2. 다시 로그인하면 새로운 권한 동의 화면이 표시됨
3. "Google Drive 파일 관리" 권한을 포함한 모든 권한에 동의

### 방법 2: Google Cloud Console에서 Scope 추가

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/

2. **프로젝트 선택**
   - 프로젝트 ID: `656726376892` (teamcodebridgeworkspace)

3. **OAuth 동의 화면으로 이동**
   - 왼쪽 메뉴: "API 및 서비스" → "OAuth 동의 화면"
   - 또는 직접 링크: https://console.cloud.google.com/apis/credentials/consent

4. **범위(Scope) 편집**
   - "범위 편집" 또는 "EDIT APP" 버튼 클릭
   - "범위 추가 또는 삭제" 섹션으로 이동

5. **Google Drive API Scope 추가**
   - "범위 추가 또는 삭제" 버튼 클릭
   - 검색창에 "drive" 입력
   - 다음 scope를 찾아서 체크:
     ```
     https://www.googleapis.com/auth/drive.file
     ```
   - 설명: "앱에서 생성하거나 여는 Google Drive 파일만 보고, 수정하고, 생성하고, 삭제"
   - ⚠️ **주의**: `.../drive` (전체 접근)이 아닌 `.../drive.file` (앱이 생성한 파일만)을 선택해야 합니다!

6. **저장 및 계속**
   - "저장 후 계속" 버튼 클릭
   - 변경사항 저장

7. **테스트 사용자 확인** (앱이 "테스트" 모드인 경우)
   - "테스트 사용자" 섹션에 사용 중인 Google 계정이 추가되어 있는지 확인
   - 없으면 "ADD USERS" 버튼으로 추가

### 방법 3: 기존 세션 강제 초기화

서버에서 모든 세션을 초기화하려면:

```bash
# 서버 접속
ssh root@e2g.teamcodebridge.dev

# Docker 컨테이너 재시작 (세션 초기화)
cd /root/teamcodebridge
docker-compose restart web
```

## 확인 방법

1. 로그아웃 → 재로그인
2. Google 동의 화면에서 다음 권한이 표시되는지 확인:
   - ✅ Google 계정의 기본 프로필 보기
   - ✅ 기본 Google 계정의 이메일 주소 확인
   - ✅ **앱에서 생성하거나 여는 Google Drive 파일만 관리** ← 이게 중요!

## 현재 설정된 Scopes

`lib/auth.ts`에 다음 scopes가 설정되어 있습니다:

```typescript
scope: [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.file', // 앱이 생성한 파일만 접근
].join(' ')
```

## 보안 참고사항

- `drive.file` scope는 **앱이 생성한 파일만** 접근 가능 (보안상 안전)
- 사용자의 기존 Google Drive 파일에는 접근할 수 없음
- TeamCodeBridge 폴더 (`1tZGBH3CXom6Hj7p5EyjKqDrzi-O4v99I`)에 업로드되는 파일만 관리

## 추가 도움

문제가 계속되면:
1. 브라우저의 쿠키와 캐시 삭제
2. 시크릿 모드에서 테스트
3. Google 계정 보안 설정에서 "TeamCodeBridge" 앱 권한 확인 및 재승인
   - https://myaccount.google.com/permissions

## API 활성화 확인

Google Cloud Console에서 다음 API가 활성화되어 있는지 확인:

1. **Google Drive API**
   - https://console.cloud.google.com/apis/library/drive.googleapis.com
   - "사용 설정" 버튼이 "API 관리"로 표시되어야 함 (이미 활성화된 상태)

2. **Google Picker API**
   - https://console.cloud.google.com/apis/library/picker.googleapis.com
   - "사용 설정" 버튼 클릭

두 API 모두 활성화되어 있어야 Google Drive 통합이 작동합니다.

