# 다이어그램 기반 데이터 처리 시스템 개발 체크리스트

## 📋 작업 개요
- **총 예상 기간**: 14주
- **핵심 원칙**: 코어 비즈니스 로직은 TDD 방식으로 구현
- **커밋 메시지**: 한글로 작성
- **프로젝트 구조**: 모노레포(pnpm workspaces + Turbo)

---

## 🎯 1단계 (MVP) - 4주

### 주 1: 모노레포 환경 설정

#### 모노레포 기본 구조 설정
- [x] 루트 package.json 및 pnpm-workspace.yaml 설정
- [x] apps/frontend, apps/backend 폴더 생성
- [x] packages/common, packages/api-client, packages/utils 폴더 생성
- [x] Turbo 설정 (turbo.json)
- [x] 공통 TypeScript 설정 (tsconfig.json)
- [x] **[커밋]** 모노레포 기본 구조 설정 완료

#### 공통 패키지 초기 설정
- [x] packages/common 패키지 설정 및 기본 타입 정의
- [x] packages/utils 패키지 설정 및 기본 유틸리티 함수
- [x] packages/api-client 패키지 설정 및 기본 구조
- [x] 패키지 간 의존성 설정 및 import 테스트
- [x] **[커밋]** 공통 패키지 초기 설정 완료

### 주 2: 프론트엔드 및 백엔드 기본 설정

#### 프론트엔드 (apps/frontend) 설정
- [x] React TypeScript 프로젝트 생성
- [x] Mantine UI 라이브러리 설치 및 설정
- [x] Tailwind CSS 설정
- [x] Redux Toolkit 설정
- [x] React Flow 라이브러리 설치 및 기본 설정
- [x] **[커밋]** 프론트엔드 기본 설정 완료

#### 백엔드 (apps/backend) 설정
- [x] Node.js TypeScript 프로젝트 생성
- [x] Express.js 서버 설정
- [x] TypeORM 설정 및 기본 엔티티 정의
- [x] CORS, body-parser 등 미들웨어 설정
- [x] 기본 라우터 구조 설정
- [x] **[커밋]** 백엔드 기본 설정 완료

#### 개발 환경 통합
- [x] ESLint, Prettier 모노레포 전체 설정
- [x] Jest 테스트 환경 설정 (각 패키지별)
- [x] Turbo를 통한 통합 빌드/테스트 스크립트 설정
- [x] **[커밋]** 개발 환경 통합 설정 완료

### 주 3: 기본 UI 구성

#### 기본 레이아웃 구현
- [x] Mantine AppShell을 활용한 기본 레이아웃
- [x] 헤더, 사이드바, 캔버스, 속성패널 컴포넌트 구현
- [x] React Flow 캔버스 기본 구조 구현
- [x] **[커밋]** 기본 UI 레이아웃 구현

#### 공통 컴포넌트 및 훅
- [x] 공통 UI 컴포넌트 라이브러리 구축
- [x] 상태 관리 스토어 기본 구조 설정
- [x] API 클라이언트 기본 구조 구현
- [x] **[커밋]** 공통 컴포넌트 및 상태 관리 완료

### 주 4: MySQL 연동 (TDD 적용)

#### 데이터베이스 연결 모듈 (TDD)
- [x] packages/common에 DB 관련 타입 정의
- [x] 데이터베이스 연결 테스트 작성
- [x] DatabaseConnector 인터페이스 정의
- [x] MySQLConnector 클래스 구현
- [x] 연결 풀 관리 기능 구현
- [x] 연결 상태 체크 기능 구현
- [x] **[커밋]** MySQL 연결 모듈 구현 완료

#### 쿼리 실행 엔진 (TDD)
- [x] 쿼리 실행 테스트 작성
- [x] SQL 인젝션 방지 로직 테스트 작성
- [x] QueryExecutor 클래스 구현 (MySQLConnector에 통합)
- [x] 쿼리 결과 파싱 기능 구현
- [x] 에러 처리 로직 구현
- [x] **[커밋]** 쿼리 실행 엔진 구현 완료

#### API 및 프론트엔드 연동
- [x] packages/api-client에 DB API 클라이언트 구현
- [x] 데이터베이스 연결 테스트 API 구현
- [x] 쿼리 실행 API 구현
- [x] 프론트엔드 DB 연동 컴포넌트 구현 (Mantine 기반)
- [x] **[커밋]** DB 연동 기능 완료

---

## 🚀 2단계 - 6주

### 주 5-6: 노드 시스템 구현

#### 노드 타입 정의 및 구조 (packages/common)
- [x] 노드 타입 인터페이스 정의 (common 패키지)
- [x] DatabaseNode, ProcessingNode, OutputNode 타입 정의
- [x] 노드 검증 유틸리티 함수 구현 (packages/utils)
- [x] **[커밋]** 노드 타입 시스템 구현 완료

#### React Flow 노드 시스템
- [x] Mantine 기반 노드 컴포넌트 구현
- [x] 드래그 앤 드롭 시스템 구현
- [x] 노드 라이브러리 패널 구현 (Mantine Card, List 활용)
- [x] **[커밋]** 노드 시스템 UI 구현 완료

#### 속성 패널 시스템
- [x] Mantine Tabs, Form 기반 동적 폼 시스템
- [x] 노드별 속성 설정 UI 구현
- [x] 드래그 앤 드롭과 노드 선택 시스템 통합
- [x] 모든 노드 타입별 속성 UI 구현 (Database, Filter, Aggregate, Transform, Join, Python, Output)
- [x] 실시간 유효성 검사 기능 구현 (useNodeValidation Hook)
- [x] 검증 결과 시각적 피드백 (오류/경고 Alert 표시)
- [x] TypeScript 타입 안전성 보장 (타입 가드 추가)
- [x] 크롬 브라우저 호환성 개선 (드래그 앤 드롭 시각적 피드백, 더블클릭 대체 기능)
- [x] 더블클릭으로 노드 추가 기능 완성
- [x] **[커밋]** 더블클릭 노드 추가 기능 및 속성 패널 시스템 완료

### 주 7-8: 데이터 처리 엔진 (TDD 적용)

#### 필터링 엔진 (TDD)
- [x] packages/common에 FilterRule 타입 정의
- [x] 필터링 로직 테스트 작성
- [x] 다양한 필터 타입 구현 (=, >, <, LIKE, IN 등)
- [x] 복합 필터 조건 처리 구현 (FilterGroup 포함)
- [x] **[커밋]** 필터링 엔진 구현 완료

#### 집계 및 변환 엔진 (TDD)
- [x] AggregateRule, TransformRule 타입 정의
- [x] 집계/변환 로직 테스트 작성
- [x] 기본 집계 함수 구현 (COUNT, SUM, AVG, MIN, MAX)
- [x] 데이터 변환 기능 구현
- [x] **[커밋]** 데이터 처리 엔진 구현 완료

#### 처리 노드 UI 구현
- [ ] Mantine 기반 필터링 설정 UI
- [ ] 집계/변환 설정 UI 구현
- [ ] 결과 미리보기 기능 구현
- [ ] **[커밋]** 데이터 처리 노드 UI 완료

### 주 9-10: Logpresso 연동 및 실행 엔진

#### Logpresso 커넥터 및 실행 엔진 (TDD)
- [ ] Logpresso 연결 테스트 작성
- [ ] LogpressoConnector 클래스 구현
- [ ] 다이어그램 실행 엔진 구현 (TDD)
- [ ] packages/api-client에 실행 관련 API 추가
- [ ] **[커밋]** Logpresso 연동 및 실행 엔진 완료

#### 다이어그램 저장/불러오기
- [ ] 다이어그램 CRUD API 구현
- [ ] 프론트엔드 저장/불러오기 기능 구현
- [ ] **[커밋]** 다이어그램 저장/불러오기 기능 완료

---

## 🔥 3단계 - 4주

### 주 11-12: 고급 기능 구현

#### 실시간 데이터 처리 (TDD)
- [ ] WebSocket 기반 실시간 처리 구현
- [ ] 파이썬 코드 실행 노드 구현 (TDD)
- [ ] 성능 최적화 (캐싱, 페이징 등)
- [ ] **[커밋]** 고급 기능 구현 완료

### 주 13-14: 완성도 향상

#### UI/UX 개선 및 통합 테스트
- [ ] Mantine 기반 UI/UX 개선
- [ ] 모노레포 전체 통합 테스트 구현
- [ ] 에러 처리 시스템 완성
- [ ] **[커밋]** 완성도 향상 완료

#### 문서화 및 배포
- [ ] 모노레포 빌드/배포 파이프라인 구축
- [ ] Docker 컨테이너화 (멀티 스테이지 빌드)
- [ ] API 문서 및 사용자 가이드 작성
- [ ] **[커밋]** 문서화 및 배포 준비 완료

---

## 🛠️ 모노레포 관리 체크리스트

### 지속적 관리
- [ ] 패키지 의존성 정기 업데이트
- [ ] Turbo 캐시 최적화
- [ ] 코드 중복 제거 및 공통 패키지 활용 극대화
- [ ] 패키지별 독립적인 배포 가능 여부 확인

### 품질 관리
- [ ] 모든 패키지 코드 커버리지 80% 이상 유지
- [ ] 패키지 간 순환 의존성 방지
- [ ] 공통 타입 일관성 유지

---

**참고사항:**
- 모노레포 구조로 인한 공통 코드 최대 활용
- 패키지별 독립적인 테스트 및 빌드 가능
- Turbo를 통한 효율적인 빌드 파이프라인 구축
- 타입 안전성을 위한 공통 타입 시스템 활용 