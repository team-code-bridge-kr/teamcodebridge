# 배포 가이드

TeamCodeBridge 시스템은 독립적인 서비스로 분리되어 배포됩니다.

## 서비스 구조

- **Web 서비스** (`next.teamcodebridge.dev`): 마케팅 홈페이지 (main 브랜치)
- **E2G 워크스페이스** (`e2g.teamcodebridge.dev`): 멘토 워크스페이스 + Socket 통신 (feat/mentor-workspace-next 브랜치)
- **Sogo Mail**: 이메일 서비스 (별도 관리)

## 독립 배포 시스템

각 서비스는 독립적으로 배포되므로, 한 서비스를 배포해도 다른 서비스에 영향을 주지 않습니다.

### Web 서비스 배포 (next.teamcodebridge.dev)

**브랜치**: `main`

**Docker Compose 파일**: `docker-compose.web.yml`

**배포 방법**:
```bash
# 서버에서 직접 배포
cd /root/teamcodebridge
git checkout main
git pull origin main
docker-compose -f docker-compose.web.yml down
docker-compose -f docker-compose.web.yml build --no-cache
docker-compose -f docker-compose.web.yml up -d
```

**GitHub Actions**: `deploy-web.yml` 워크플로우가 자동으로 실행됩니다.

### E2G 워크스페이스 배포 (e2g.teamcodebridge.dev)

**브랜치**: `feat/mentor-workspace-next`

**Docker Compose 파일**: `docker-compose.e2g.yml`

**배포 방법**:
```bash
# 서버에서 직접 배포
cd /root/teamcodebridge
git checkout feat/mentor-workspace-next
git pull origin feat/mentor-workspace-next
docker-compose -f docker-compose.e2g.yml down
docker-compose -f docker-compose.e2g.yml build --no-cache
docker-compose -f docker-compose.e2g.yml up -d
```

**GitHub Actions**: `deploy-e2g.yml` 워크플로우가 자동으로 실행됩니다.

## 포트 구성

- **Web 서비스**: `3000:3000` (내부:외부)
- **E2G Web**: `3001:3000` (내부:외부)
- **Socket 서비스**: `4000:4000` (내부:외부)

## 네트워크 분리

각 서비스는 독립적인 Docker 네트워크를 사용합니다:
- `web-network`: Web 서비스 전용
- `e2g-network`: E2G 워크스페이스 + Socket 통신

## 환경 변수

각 서비스는 동일한 `.env` 파일을 사용하지만, 서비스별로 필요한 변수만 사용합니다.

## 배포 확인

### Web 서비스 확인
```bash
docker ps | grep teamcodebridge-web
docker-compose -f docker-compose.web.yml logs --tail=50 web
```

### E2G 서비스 확인
```bash
docker ps | grep -E "teamcodebridge-e2g-web|teamcodebridge-socket"
docker-compose -f docker-compose.e2g.yml logs --tail=50
```

## 문제 해결

### 서비스가 시작되지 않는 경우

1. 로그 확인:
   ```bash
   docker-compose -f docker-compose.web.yml logs
   docker-compose -f docker-compose.e2g.yml logs
   ```

2. 컨테이너 상태 확인:
   ```bash
   docker ps -a
   ```

3. 이미지 재빌드:
   ```bash
   docker-compose -f docker-compose.web.yml build --no-cache
   docker-compose -f docker-compose.e2g.yml build --no-cache
   ```

### 포트 충돌

각 서비스는 다른 포트를 사용하므로 충돌이 발생하지 않아야 합니다. 만약 충돌이 발생하면:
```bash
# 사용 중인 포트 확인
netstat -tulpn | grep -E "3000|3001|4000"
```

## Kubernetes 마이그레이션 (향후 계획)

현재는 Docker Compose를 사용하지만, 향후 Kubernetes로 마이그레이션할 계획입니다:
- 각 서비스를 독립적인 Deployment로 관리
- Service와 Ingress로 트래픽 라우팅
- ConfigMap과 Secret으로 환경 변수 관리
- Horizontal Pod Autoscaler로 자동 스케일링

