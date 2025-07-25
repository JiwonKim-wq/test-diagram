# 다이어그램 기반 데이터 처리 시스템 요건정의서

## 1. 프로젝트 개요

### 1.1 목적
- 시각적 다이어그램을 통한 직관적인 데이터 처리 시스템 구현
- 데이터 소스 연결 및 가공 프로세스의 시각화
- 사용자 친화적인 데이터 파이프라인 구성

### 1.2 범위
- 다이어그램 생성 및 편집 기능
- 데이터베이스 연결 관리
- 데이터 가공 프로세스 정의
- 실시간 데이터 처리 모니터링

## 2. 기능 요구사항

### 2.1 다이어그램 편집기
- 드래그 앤 드롭 방식의 다이어그램 생성
- 다양한 유형의 노드 제공:
  * 데이터 소스 노드
  * 데이터 가공 노드
  * 출력/시각화 노드
- 노드 간 연결선 생성 및 관리
- 다이어그램 저장 및 불러오기

### 2.2 데이터 소스 노드 기능
- 더블클릭 시 데이터베이스 연결 설정 UI 표시
- 지원 데이터베이스:
  * MySQL
  * PostgreSQL
  * MongoDB
  * Redis
- 연결 정보 입력 및 테스트
- 쿼리 작성 및 실행
- 연결 상태 모니터링

### 2.3 데이터 가공 노드 기능
- 데이터 변환 규칙 정의
- 지원 가공 유형:
  * 필터링
  * 집계
  * 정렬
  * 조인
  * 포맷 변환
- 실시간 데이터 미리보기
- 에러 처리 및 로깅

### 2.4 사용자 인터페이스
- 직관적인 다이어그램 작업 영역
- 노드 라이브러리 패널
- 속성 편집 패널
- 실행 결과 미리보기
- 에러 및 경고 표시

## 3. 기술 요구사항

### 3.1 프로젝트 구조
- **모노레포(Monorepo) 구조**로 관리
- 워크스페이스 관리: pnpm workspaces 또는 yarn workspaces
- 패키지 빌드/테스트 관리: Turbo 또는 Nx

### 3.2 프론트엔드
- React.js 기반 구현
- 다이어그램 라이브러리: React Flow 또는 Mermaid
- 상태 관리: Redux 또는 Context API
- 스타일링: Tailwind CSS
- **UI 컴포넌트 라이브러리: Mantine**

### 3.3 백엔드
- Node.js
- TypeScript
- Express.js
- TypeORM (데이터베이스 ORM)

### 3.4 공통 패키지
- **타입 정의**: API 인터페이스, 데이터 모델 등 공통 타입
- **유틸리티**: 공통 함수, 검증 로직, 상수 등
- **API 클라이언트**: 프론트엔드에서 사용할 백엔드 API 클라이언트

### 3.5 데이터베이스 연동
- 데이터베이스 커넥터 모듈
- 연결 풀 관리
- 쿼리 실행 엔진
- 보안 인증 관리

### 3.6 성능 요구사항
- 다이어그램 렌더링: 1초 이내
- 데이터베이스 연결: 3초 이내
- 데이터 가공: 5초 이내 (일반적인 데이터셋 기준)

## 4. 구현 우선순위

### 4.1 1단계 (MVP)
- 기본 다이어그램 편집 기능
- MySQL 데이터베이스 연결
- 기본 UI 구현

### 4.2 2단계
- 추가 데이터베이스 지원
- 고급 데이터 가공 기능
- 다이어그램 템플릿 기능
- 실행 이력 관리

### 4.3 3단계
- 실시간 데이터 처리
- 데이터 파이프라인 자동화
- 사용자 협업 기능
- 대시보드 통합

## 5. 품질 요구사항

### 5.1 사용성
- 직관적인 드래그 앤 드롭 인터페이스
- 실시간 피드백 제공
- 작업 실행 취소/재실행

### 5.2 안정성
- 데이터 처리 중 오류 복구
- 작업 내용 자동 저장
- 시스템 리소스 모니터링
- 백업 및 복구 기능

### 5.3 보안
- 데이터베이스 접속 정보 암호화
- 작업 이력 추적
- 보안 감사 로깅

## 6. 제약사항 및 가정

### 6.1 제약사항
- 웹 브라우저 환경에서 실행
- 데이터베이스 서버 접근 가능
- 네트워크 연결 필요
- 브라우저 메모리 제한

### 6.2 가정
- 사용자는 기본적인 데이터베이스 지식 보유
- 안정적인 네트워크 환경
- 데이터베이스 서버 정상 운영
- 최신 웹 브라우저 사용

## 7. 향후 확장 계획

### 7.1 기능 확장
- AI 기반 데이터 분석 노드
- 외부 API 연동
- 커스텀 노드 개발 기능
- 모바일 지원

### 7.2 성능 개선
- 대용량 데이터 처리
- 분산 처리 지원
- 캐싱 시스템 도입
- 실행 최적화 엔진 

## 8. 구현 전 사전 질문 사항

### 8.1 데이터베이스 관련 질문
1. 연동해야 할 데이터베이스의 종류는 무엇입니까?
- 일단은 Mysql, logpresso인데 여러 데이터베이스를 다 선택할 수 있게 하고싶음(일단은 mysql, logpresso만 먼저 테스트.)

2. 데이터베이스 서버의 접속 정보(호스트, 포트)가 이미 정해져 있습니까?
- 정해져 있지 않음. 사용자가 직접 호스트와 포트를 그때그때 입력하면 해당 접속정보로 연결하는 방식

3. 처리해야 할 데이터의 예상 규모는 어느 정도입니까?
- 일단은 테스트에서는 그리 큰 용량을 사용하진 않을거지만 이게 잘 된다면 대용량의 데이터도 받아서 진행할 예정

### 8.2 다이어그램 노드 타입 관련 질문
1. 데이터를 불러오는 노드에서 필요한 구체적인 기능이 있습니까? (예: 특정 테이블만 조회, 조건부 조회 등)
- 쿼리를 직접 웹에서 짜서 보내주면 해당하는 쿼리의 결과값을 받아오기만 하면 됨

2. 데이터 가공 노드에서 어떤 종류의 가공이 주로 필요하십니까? (예: 필터링, 집계, 변환 등)
- 예시에 있듯이 필터링,집계,변환이 필요해

3. 결과를 어떤 형태로 출력하기를 원하십니까? (차트, 테이블, 파일 등)
- 일단은 테이블로 보이는게 좋을듯함.

### 8.3 UI/UX 요구사항 관련 질문
1. 다이어그램 편집 화면의 레이아웃에 대한 특별한 선호사항이 있으십니까?
- 따로 없음 일단은 기능 적용 후 추후 수정 예정

2. 노드 더블클릭 시 표시될 설정 UI의 형태에 대한 구체적인 요구사항이 있으십니까?
- 따로 없음 일단은 기능 적용 후 추후 수정 예정

3. 다이어그램 저장/불러오기 기능이 필요하십니까?
- 필요함

### 8.4 성능 요구사항 관련 질문
1. 데이터 처리 시 허용 가능한 최대 지연 시간이 있습니까?
- 따로 없음 일단은 적용 후 추후 보완 예정

2. 동시에 처리해야 할 최대 노드 수는 몇 개 정도로 예상하십니까?
- 일단은 두개

3. 실시간 데이터 처리가 필요합니까?
- 실시간 데이터 처리 필요함

### 8.5 보안 요구사항 관련 질문
1. 데이터베이스 접속 정보 관리 방식에 대한 특별한 요구사항이 있습니까?
- 없음

2. 사용자 권한 관리가 필요합니까?
- 필요없음

3. 데이터 처리 이력을 저장해야 합니까?
- 저장해야됨

### 8.6 개발 환경 관련 질문
1. 현재 프로젝트에서 사용 중인 상태 관리 라이브러리가 있습니까? (Redux, Context API 등)
- 아직 특별히 없음

2. 선호하는 다이어그램 라이브러리가 있으십니까? (React Flow, Mermaid 등)
- 없음.

3. 백엔드 API는 어떤 형태로 구현되어 있습니까?
- node.jS (typeScript)

### 8.7 구현 우선순위 관련 질문
1. 가장 먼저 구현이 필요한 핵심 기능은 무엇입니까?
- DB 연동 후 쿼리 적용

2. MVP(Minimum Viable Product) 단계에서 반드시 포함되어야 할 기능은 무엇입니까?
- DB 연동 후 쿼리 적용

3. 향후 확장 계획 중 우선순위가 높은 기능이 있습니까?
- 파이썬 코드 적용

