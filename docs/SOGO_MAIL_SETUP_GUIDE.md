# sogo mail 발신자 의존 전송 설정 가이드

## 단계별 설정 방법

### 1단계: sogo mail 관리자 페이지 접속
1. sogo mail 관리자 페이지에 로그인
2. `support@teamcodebridge.dev` 계정 선택
3. **"발신자 의존 전송"** 메뉴 클릭

### 2단계: SMTP 설정 추가
**"+ 추가"** 버튼을 클릭하여 새 설정을 추가합니다.

### 3단계: 각 필드 입력

#### 호스트 (Host) 필드
다음 중 하나를 입력하세요:

**옵션 1 (포트 포함):**
```
smtp.sogo.co.kr:587
```

**옵션 2 (포트 포함, 대체 서버):**
```
mail.sogo.co.kr:587
```

**옵션 3 (포트 없이):**
```
smtp.sogo.co.kr
```

**참고:**
- 포트 587: TLS 사용 (권장)
- 포트 465: SSL 사용
- 포트를 호스트에 포함하지 않으면 기본 포트 사용

#### 사용자 이름 (Username) 필드
```
support@teamcodebridge.dev
```

#### 비밀번호 (Password) 필드
```
support@teamcodebridge.dev 계정의 비밀번호
```

**보안 권장사항:**
- 일반 비밀번호 대신 **앱 비밀번호** 사용 권장
- 앱 비밀번호가 있다면 앱 비밀번호를 입력

### 4단계: 저장
**"+ 추가"** 버튼을 클릭하여 설정을 저장합니다.

## 서버 환경 변수 설정

발신자 의존 전송에서 설정한 값을 서버의 `.env` 파일에 다음과 같이 매핑합니다:

### 설정 예시

**발신자 의존 전송 설정:**
```
호스트: smtp.sogo.co.kr:587
사용자 이름: support@teamcodebridge.dev
비밀번호: mypassword123
```

**서버 .env 파일:**
```env
SMTP_HOST=smtp.sogo.co.kr
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@teamcodebridge.dev
SMTP_PASS=mypassword123
```

### 매핑 규칙

| 발신자 의존 전송 필드 | 환경 변수 | 예시 값 |
|---------------------|----------|---------|
| 호스트 (포트 포함) | `SMTP_HOST` + `SMTP_PORT` | `smtp.sogo.co.kr` + `587` |
| 호스트 (포트 없음) | `SMTP_HOST` | `smtp.sogo.co.kr` |
| 사용자 이름 | `SMTP_USER` | `support@teamcodebridge.dev` |
| 비밀번호 | `SMTP_PASS` | `[비밀번호]` |

### 포트별 설정

**포트 587 (TLS) 사용 시:**
```env
SMTP_HOST=smtp.sogo.co.kr
SMTP_PORT=587
SMTP_SECURE=false
```

**포트 465 (SSL) 사용 시:**
```env
SMTP_HOST=smtp.sogo.co.kr
SMTP_PORT=465
SMTP_SECURE=true
```

## 테스트 방법

설정이 완료되면:

1. 회의 일정 투표 생성 → 모든 멘토에게 이메일 발송 확인
2. 최종 일정 확정 → 모든 멘토에게 확정 알림 이메일 발송 확인

## 문제 해결

### 이메일이 발송되지 않는 경우

1. **발신자 의존 전송 설정 확인**
   - 호스트, 사용자 이름, 비밀번호가 정확한지 확인
   - sogo mail 관리자 페이지에서 설정이 저장되었는지 확인

2. **환경 변수 확인**
   - 서버의 `.env` 파일에 모든 변수가 올바르게 설정되었는지 확인
   - 포트 번호가 호스트에 포함되어 있다면 `SMTP_HOST`에서 포트 제외

3. **포트 및 보안 설정**
   - 포트 587 사용 시: `SMTP_SECURE=false`
   - 포트 465 사용 시: `SMTP_SECURE=true`

4. **로그 확인**
   ```bash
   docker-compose logs web | grep -i email
   docker-compose logs web | grep -i smtp
   ```

## 주의사항

⚠️ **보안 경고**: 
- 발신자 의존 전송 설정에서 "인증 데이터가 있는 경우 일반 텍스트로 저장되는 것을 주의해주세요"라는 경고가 있습니다.
- 비밀번호는 일반 텍스트로 저장되므로, 앱 비밀번호 사용을 강력히 권장합니다.
- 서버의 `.env` 파일도 일반 텍스트이므로 접근 권한을 제한하세요.

