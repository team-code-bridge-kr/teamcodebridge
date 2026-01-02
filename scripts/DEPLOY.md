# 배포 스크립트 가이드

## 주요 배포 스크립트

### `deploy_base64_files.exp`
최신 배포 스크립트입니다. GitHub에서 최신 코드를 pull하고 Docker 컨테이너를 재빌드합니다.

**사용법:**
```bash
chmod +x deploy_base64_files.exp
./deploy_base64_files.exp
```

### `run_migrate.exp`
데이터베이스 마이그레이션을 실행합니다.

**사용법:**
```bash
chmod +x run_migrate.exp
./run_migrate.exp
```

## 아카이브된 스크립트

일회성 작업용 스크립트들은 `scripts/exp_archive/` 폴더에 보관되어 있습니다.
필요시 해당 폴더에서 찾아서 사용할 수 있습니다.

