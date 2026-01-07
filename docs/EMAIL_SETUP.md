# 이메일 발송 설정 가이드

## sogo mail SMTP 설정

### 1. sogo mail 관리자 페이지에서 "발신자 의존 전송" 설정

1. sogo mail 관리자 페이지에 로그인
2. `support@teamcodebridge.dev` 계정 설정으로 이동
3. **"발신자 의존 전송"** 메뉴로 이동
4. **"+ 추가"** 버튼 클릭하여 새 SMTP 설정 추가

### 2. 발신자 의존 전송 설정 값 입력

**호스트 (Host) 필드:**
```
smtp.sogo.co.kr:587
```
또는
```
mail.sogo.co.kr:587
```
또는 (포트 없이)
```
smtp.sogo.co.kr
```

**사용자 이름 (Username) 필드:**
```
support@teamcodebridge.dev
```

**비밀번호 (Password) 필드:**
```
support@teamcodebridge.dev 계정의 비밀번호 또는 앱 비밀번호
```

### 3. 설정 예시

```
호스트: smtp.sogo.co.kr:587
사용자 이름: support@teamcodebridge.dev
비밀번호: [계정 비밀번호 또는 앱 비밀번호]
```

**주의사항:**
- 인증 데이터(비밀번호)는 일반 텍스트로 저장됩니다
- 보안을 위해 앱 비밀번호 사용을 권장합니다
- 포트 번호는 호스트 필드에 포함하거나 별도로 설정할 수 있습니다

### 2. 앱 비밀번호 생성 (권장)

일반 비밀번호 대신 앱 비밀번호를 사용하는 것을 권장합니다:

1. sogo mail 관리자 페이지에서 `support@teamcodebridge.dev` 계정 설정
2. "앱 비밀번호" 또는 "애플리케이션 비밀번호" 메뉴로 이동
3. 새 앱 비밀번호 생성
4. 생성된 비밀번호를 복사 (한 번만 표시됨)

### 4. 환경 변수 설정

서버의 `.env` 파일에 다음 변수를 추가하세요:

```env
# sogo mail SMTP 설정 (발신자 의존 전송에서 설정한 값 사용)
SMTP_HOST=smtp.sogo.co.kr          # 발신자 의존 전송의 "호스트"에서 포트 제외한 부분
SMTP_PORT=587                       # 발신자 의존 전송의 "호스트"에 포함된 포트 번호
SMTP_SECURE=false                   # TLS: false (포트 587), SSL: true (포트 465)
SMTP_USER=support@teamcodebridge.dev  # 발신자 의존 전송의 "사용자 이름"
SMTP_PASS=your_password_here        # 발신자 의존 전송의 "비밀번호"
```

**sogo mail 발신자 의존 전송 설정과 환경 변수 매핑:**
- 발신자 의존 전송 "호스트": `smtp.sogo.co.kr:587` → `SMTP_HOST=smtp.sogo.co.kr`, `SMTP_PORT=587`
- 발신자 의존 전송 "사용자 이름": `support@teamcodebridge.dev` → `SMTP_USER=support@teamcodebridge.dev`
- 발신자 의존 전송 "비밀번호": `[비밀번호]` → `SMTP_PASS=[비밀번호]`

### 4. 서버 환경 변수 설정

프로덕션 서버의 `.env` 파일에도 동일한 설정을 추가하세요:

```bash
# 서버에서 .env 파일 수정
nano /root/teamcodebridge/.env

# 또는 docker-compose.yml의 env_file에 추가
```

### 5. 테스트

설정이 완료되면 다음을 테스트하세요:

1. 회의 일정 투표 생성 → 모든 멘토에게 이메일 발송
2. 최종 일정 확정 → 모든 멘토에게 확정 알림 이메일 발송

## 이메일 발송 이벤트

현재 다음 이벤트에서 이메일이 자동으로 발송됩니다:

1. **회의 일정 투표 생성 시**
   - 수신자: 모든 멘토 (MENTOR 역할)
   - 내용: 투표 제목, 설명, 작성자 정보, 투표 링크

2. **최종 일정 확정 시**
   - 수신자: 모든 멘토 (MENTOR 역할)
   - 내용: 확정된 일정 날짜/시간, 일정 확인 링크

## 문제 해결

### 이메일이 발송되지 않는 경우

1. **SMTP 설정 확인**
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` 확인
   - sogo mail 관리자 페이지에서 SMTP 설정 확인

2. **포트 및 보안 설정**
   - TLS 사용 시: `SMTP_PORT=587`, `SMTP_SECURE=false`
   - SSL 사용 시: `SMTP_PORT=465`, `SMTP_SECURE=true`

3. **로그 확인**
   - 서버 로그에서 이메일 발송 에러 확인
   - `docker-compose logs web | grep -i email`

4. **방화벽 확인**
   - SMTP 포트(587 또는 465)가 열려있는지 확인

### 일반적인 SMTP 서버 주소

- sogo mail: `smtp.sogo.co.kr` 또는 `mail.sogo.co.kr`
- Gmail: `smtp.gmail.com`
- 네이버: `smtp.naver.com`
- Outlook: `smtp-mail.outlook.com`

## 향후 확장 계획

- 알림톡 연동 (카카오 비즈니스 API)
- 개인별 이메일 설정 (각 멘토의 등록된 Gmail로 발송)
- 이메일 템플릿 커스터마이징

