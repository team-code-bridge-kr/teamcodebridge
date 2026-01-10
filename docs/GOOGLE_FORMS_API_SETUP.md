# 📝 Google Forms API 설정 가이드

Google Forms API를 사용하여 프로그래밍 방식으로 설문조사를 생성하고 관리할 수 있습니다.

## ✅ Google Forms API 활성화

### 1️⃣ Google Cloud Console 접속

```
https://console.cloud.google.com/
```

### 2️⃣ 프로젝트 선택

- 프로젝트 ID: `656726376892` (teamcodebridgeworkspace)
- 또는 상단 드롭다운에서 프로젝트 선택

### 3️⃣ Google Forms API 활성화

**직접 링크**:
```
https://console.cloud.google.com/apis/library/forms.googleapis.com?project=656726376892
```

또는 수동으로:
1. 왼쪽 메뉴: "API 및 서비스" → "라이브러리"
2. 검색창에 "Google Forms API" 입력
3. **Google Forms API** 클릭
4. **"사용" 또는 "ENABLE"** 버튼 클릭
5. 버튼이 "API 관리"로 바뀌면 성공! ✅

### 4️⃣ OAuth 동의 화면에서 Scope 추가

**직접 링크**:
```
https://console.cloud.google.com/apis/credentials/consent?project=656726376892
```

1. **"범위 편집" 또는 "EDIT APP"** 버튼 클릭
2. **"범위 추가 또는 삭제"** 섹션으로 이동
3. **"범위 추가 또는 삭제"** 버튼 클릭
4. 검색창에 "forms" 입력
5. 다음 두 개의 scope를 체크:

```
https://www.googleapis.com/auth/forms.body
설명: "Google Forms에서 모든 양식 보기, 수정, 생성, 삭제"

https://www.googleapis.com/auth/forms.responses.readonly
설명: "Google Forms의 모든 응답 보기"
```

6. **"업데이트"** 클릭
7. **"저장 후 계속"** 클릭

## 🔐 현재 설정된 Scopes

`lib/auth.ts`에 다음 scopes가 설정되어 있습니다:

```typescript
scope: [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.file',           // Google Drive 파일 관리
    'https://www.googleapis.com/auth/forms.body',           // Google Forms 생성/수정 ✨ NEW
    'https://www.googleapis.com/auth/forms.responses.readonly', // Google Forms 응답 읽기 ✨ NEW
].join(' ')
```

## 🧪 테스트

API 활성화 후:

1. **로그아웃 → 재로그인**
   - 새로운 권한 동의 화면이 표시됩니다
   - "Google Forms에서 모든 양식 보기, 수정, 생성, 삭제" 권한 확인
   - "Google Forms의 모든 응답 보기" 권한 확인

2. **만족도조사 관리 페이지 접속**
   ```
   https://e2g.teamcodebridge.dev/workspace/surveys
   ```

3. **"+ 새 설문 만들기" 버튼 클릭**

4. **설문조사 정보 입력**
   - 설문조사명
   - 설명
   - 대상 수업
   - 설문 기간

5. **"다음" → 질문 설정**
   - "추천 설문폼 사용하기" 클릭 (11개 질문 자동 추가)
   - 또는 "질문 추가" 버튼으로 직접 추가

6. **"설문 생성" 버튼 클릭**

7. ✅ **성공하면 Google Forms가 자동으로 생성됩니다!**
   - Google Forms 링크가 자동으로 열립니다
   - DB에 설문조사 정보가 저장됩니다

## 📊 기능

### ✅ 구현 완료

- ✅ Google Forms 자동 생성
- ✅ 11개 질문 추천 템플릿
- ✅ 커스텀 질문 추가/수정/삭제
- ✅ 임시저장 기능
- ✅ 설문조사 목록/상세/수정/삭제
- ✅ 상태 관리 (준비중, 진행중, 종료)
- ✅ 응답 수 추적
- ✅ E2G 스타일 커스텀 Alert
- ✅ 질문 타입:
  - 단답형 (TEXT)
  - 장문형 (PARAGRAPH)
  - 객관식 (MULTIPLE_CHOICE)
  - 체크박스 (CHECKBOX)
  - 선형 배율 1-5점 (LINEAR_SCALE)
  - 날짜 (DATE)
  - 시간 (TIME)
  - 이메일 (EMAIL)
  - 전화번호 (PHONE)

### 🔜 향후 추가 가능

- Google Sheets 자동 연동
- 응답 실시간 대시보드
- 설문 결과 통계 차트
- 설문 복제 기능
- 이메일/알림톡 자동 발송

## 🚨 문제 해결

### 에러: "Forms API가 활성화되지 않음"

**원인**: Google Forms API가 Google Cloud Console에서 활성화되지 않음

**해결**:
1. 위 3️⃣ 단계 확인
2. API가 활성화되어 있는지 확인
3. 활성화 후 1-2분 대기
4. 로그아웃 → 재로그인

### 에러: "권한이 없습니다"

**원인**: OAuth Scope에 Forms API 권한이 추가되지 않음

**해결**:
1. 위 4️⃣ 단계 확인
2. OAuth 동의 화면에서 Scope 확인
3. `forms.body`와 `forms.responses.readonly` 추가
4. 로그아웃 → 재로그인 (새 권한 동의 필요)

### 에러: "accessToken이 없습니다"

**원인**: 세션에 accessToken이 저장되지 않음

**해결**:
1. 로그아웃 → 재로그인
2. 브라우저 쿠키 삭제
3. 시크릿 모드에서 테스트

## 💡 Tip

### Google Forms 수동 Sheets 연결

Google Forms가 생성된 후, 응답을 Google Sheets로 연결하려면:

1. Google Forms 열기
2. 상단 "응답" 탭 클릭
3. Google Sheets 아이콘 클릭
4. "새 스프레드시트 만들기" 선택
5. "만들기" 클릭

이렇게 하면 응답이 자동으로 Sheets에 저장됩니다!

### 추천 설문폼 템플릿

기본 11개 질문:
1. 개인정보 동의
2. 이메일 (중복 방지)
3. 전화번호 (상품 증정)
4. 프로그램 구성 적절성 (1-5점)
5. 전반적인 만족도 (1-5점)
6. 재참여 의향 (1-5점)
7. 멘토 피드백 적절성 (1-5점)
8. 얻게 된 점 (장문형)
9. 아쉬운 점/개선점 (장문형)
10. 멘토에게 하고 싶은 말 (장문형)
11. 인터뷰 연락처 (선택, 단답형)

---

**설정 완료 체크리스트**:
- [ ] Google Forms API 활성화
- [ ] OAuth Scope 추가 (forms.body, forms.responses.readonly)
- [ ] 로그아웃 → 재로그인
- [ ] 설문조사 생성 테스트
- [ ] Google Forms 자동 생성 확인

**문제가 있으면**: 이 가이드를 처음부터 다시 확인하거나, Google Cloud Console에서 API 활성화 상태를 확인하세요!

