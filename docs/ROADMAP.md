# 노션 기반 견적서 관리 시스템 개발 로드맵

노션 데이터베이스를 활용해 견적서를 관리하고, 클라이언트가 고유 URL로 조회 및 PDF 다운로드할 수 있는 웹 서비스

## 개요

invoice-web은 프리랜서/소규모 기업을 위한 노션 기반 견적서 관리 시스템으로 다음 기능을 제공합니다:

- **견적서 조회**: 고유 URL(`/invoice/[notionPageId]`)로 견적서 내용을 웹에서 즉시 확인
- **PDF 다운로드**: 견적서를 A4 규격 PDF 파일로 변환 및 다운로드
- **URL 공유**: 견적서 링크를 클립보드 복사로 이메일/메신저로 손쉽게 공유

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

   > 🚨 **구현 → 테스트 → 검증 → 다음 단계 (반드시 이 순서 준수)**
   >
   > **Step 1. 구현**: 해당 단계의 기능 코드 작성 완료
   > **Step 2. 즉시 테스트**: Playwright MCP로 구현한 기능 테스트 즉시 실행
   > **Step 3. 결과 검증**: 테스트 통과 여부 확인
   >
   > - ✅ 통과 → 작업 파일 체크리스트 업데이트 후 다음 단계 진행
   > - ❌ 실패 → 즉시 코드 수정 → Step 2로 돌아가 재테스트 (다음 단계 진행 금지)
   >
   > **테스트 시나리오 필수 포함 항목:**
   >
   > - Happy Path (정상 동작)
   > - Error Case (잘못된 입력, 권한 없음, 서버 오류)
   > - Edge Case (경계값, 빈 데이터, 최대값)

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

전체 라우트 구조, 기본 페이지 골격, 공통 레이아웃, 기본 타입을 정의합니다.

- ✅ **Task 001: 프로젝트 초기 설정** - 완료
  - Next.js 15.5.3 + TypeScript 5 + TailwindCSS v4 + shadcn/ui 구성
  - ESLint + Prettier + Husky + lint-staged 개발 도구 설정
  - 환경 변수 스키마 정의 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
  - See: `/tasks/001-project-setup.md`

- ✅ **Task 002: 라우트 구조 및 기본 페이지 생성** - 완료
  - `app/layout.tsx` - 루트 레이아웃 (Geist 폰트, 한국어 메타데이터)
  - `app/page.tsx` - 서비스 이용 안내 홈 페이지
  - `app/invoice/[id]/page.tsx` - 견적서 조회 페이지 (동적 라우트)
  - `app/not-found.tsx` - 커스텀 404 에러 페이지
  - See: `/tasks/002-route-structure.md`

- ✅ **Task 003: 공통 UI 컴포넌트 라이브러리 구성** - 완료
  - shadcn/ui 컴포넌트 설치: Button, Card, Badge, Skeleton, Dialog 등
  - `components/copy-url-button.tsx` - URL 클립보드 복사 클라이언트 컴포넌트
  - See: `/tasks/003-ui-components.md`

---

### Phase 2: UI/UX 완성 (더미 데이터 활용)

더미 데이터를 활용하여 견적서 조회 페이지의 전체 UI를 완성하고 반응형 디자인을 구현합니다.

- **Task 010: 견적서 조회 페이지 UI 완성** - 우선순위
  - 견적서 헤더 섹션: 견적서 번호, 발행일, 유효기간, 상태 배지
  - 공급자/클라이언트 정보 섹션: 회사명, 담당자, 연락처
  - 견적 항목 테이블: 항목명, 수량, 단가, 금액 (반응형 테이블)
  - 금액 요약 섹션: 공급가액, 부가세(10%), 합계 금액
  - 하단 액션 바: URL 복사 버튼, PDF 다운로드 버튼 (비활성 상태)
  - See: `/tasks/010-invoice-page-ui.md`

- **Task 011: 더미 데이터 타입 정의 및 목업 구성**
  - `src/types/invoice.ts` - 견적서 관련 TypeScript 타입 정의
    - `Invoice`, `InvoiceItem`, `InvoiceStatus` 타입
    - Notion API 응답 → 앱 내부 타입 변환 인터페이스
  - `src/lib/mock-data.ts` - 개발용 더미 견적서 데이터
  - See: `/tasks/011-types-and-mock-data.md`

- **Task 012: 반응형 레이아웃 구현** (F012)
  - 모바일(320px~) / 태블릿(768px~) / 데스크톱(1024px~) 대응
  - 견적 항목 테이블 모바일 카드 뷰 전환
  - 스티키 헤더 네비게이션 바 최적화
  - See: `/tasks/012-responsive-layout.md`

- **Task 013: 로딩/에러 상태 UI 구현**
  - `app/invoice/[id]/loading.tsx` - Skeleton 기반 로딩 UI
  - `app/invoice/[id]/error.tsx` - 에러 경계 컴포넌트
  - 견적서 없음(notFound) 처리 UI 개선
  - See: `/tasks/013-loading-error-states.md`

---

### Phase 3: 핵심 기능 구현

Notion API 연동, 견적서 데이터 조회, PDF 생성/다운로드 핵심 비즈니스 로직을 구현합니다.

- **Task 020: Notion API 연동 설정** (F001)
  - `@notionhq/client` SDK 설치 및 클라이언트 초기화
  - `src/lib/notion.ts` - Notion 클라이언트 싱글톤 구성
  - Notion API 연결 테스트 및 에러 핸들링
  - **Playwright MCP로 API 연동 동작 테스트 수행**
  - See: `/tasks/020-notion-api-setup.md`

- **Task 021: 견적서 데이터 조회 구현** (F001, F002)
  - `src/lib/notion-invoice.ts` - Notion 페이지 조회 함수
    - `getInvoiceById(id: string)` - 노션 페이지 ID로 견적서 조회
    - `parseNotionInvoice(page)` - Notion 응답 데이터 → Invoice 타입 변환
    - `getInvoiceItems(databaseId)` - 견적 항목 리스트 조회
  - `app/invoice/[id]/page.tsx` - 실제 Notion 데이터로 교체
  - **Playwright MCP로 실제 데이터 렌더링 검증**
  - See: `/tasks/021-notion-invoice-fetch.md`

- **Task 022: 견적서 유효성 검증 구현** (F011)
  - 존재하지 않는 견적서 ID 접근 시 `notFound()` 처리
  - Notion API 오류(401, 404, 429, 500) 별 에러 처리
  - 견적서 상태(status)별 접근 제어 로직
  - See: `/tasks/022-invoice-validation.md`

- **Task 023: PDF 생성 및 다운로드 구현** (F003)
  - `@react-pdf/renderer` 또는 Puppeteer 라이브러리 선택 및 설치
  - `src/components/invoice-pdf.tsx` - PDF 렌더링용 React 컴포넌트
    - 견적서 헤더, 항목 테이블, 금액 요약, 푸터 포함
    - A4 규격, 한국어 폰트 지원
  - `app/api/invoice/[id]/pdf/route.ts` - PDF 생성 API Route Handler
  - 견적서 조회 페이지 PDF 다운로드 버튼 활성화
  - **Playwright MCP로 PDF 다운로드 흐름 E2E 테스트**
  - See: `/tasks/023-pdf-generation.md`

---

### Phase 4: 고급 기능 및 최적화

캐싱, 성능 최적화, 운영 안정성, 배포 파이프라인을 완성합니다.

- **Task 030: Notion API 응답 캐싱 최적화**
  - Next.js `fetch` 캐싱 전략 적용 (`revalidate` 설정)
  - 견적서 데이터 ISR(Incremental Static Regeneration) 구성
  - API Rate Limit 대응 처리 (재시도 로직)
  - See: `/tasks/030-caching-optimization.md`

- **Task 031: SEO 및 메타데이터 최적화**
  - 견적서 페이지 동적 OG 이미지 생성 (`next/og`)
  - 견적서 클라이언트명/번호 기반 동적 메타데이터 완성
  - `robots.txt`, `sitemap.xml` 설정
  - See: `/tasks/031-seo-metadata.md`

- **Task 032: 접근성(a11y) 개선**
  - WCAG 2.1 AA 기준 준수 검토
  - 키보드 네비게이션 지원
  - 스크린 리더 aria 레이블 추가
  - See: `/tasks/032-accessibility.md`

- **Task 033: Vercel 배포 파이프라인 구성**
  - Vercel 프로젝트 연결 및 환경 변수 설정
  - GitHub Actions CI (check-all + build 검증)
  - 프리뷰 배포 및 프로덕션 배포 워크플로우
  - See: `/tasks/033-deployment.md`

- **Task 034: E2E 테스트 작성**
  - Playwright 기반 주요 흐름 테스트
    - 견적서 조회 정상 흐름
    - 잘못된 URL 접근 시 404 처리
    - PDF 다운로드 흐름
  - See: `/tasks/034-e2e-tests.md`

---

## 🧪 Playwright MCP 테스트 의무 실행 가이드

### 테스트 실행 시점 (절대 규칙)

| 작업 유형           | 테스트 시점             | 테스트 도구    |
| ------------------- | ----------------------- | -------------- |
| API 엔드포인트 구현 | 각 엔드포인트 구현 직후 | Playwright MCP |
| 비즈니스 로직 구현  | 각 로직 구현 직후       | Playwright MCP |
| UI 컴포넌트 구현    | 페이지 완성 후          | Playwright MCP |
| Notion API 연동     | 각 기능 구현 직후       | Playwright MCP |

### 테스트 진행 프로세스 (반드시 준수)

1. **구현** → 기능 코드 작성 완료
2. **🚨 즉시 테스트** → Playwright MCP로 해당 기능 테스트 실행
3. **결과 확인** → 테스트 통과 여부 검증
4. **실패 시** → 즉시 수정 후 재테스트 (다음 단계 진행 금지)
5. **통과 시** → 작업 파일 체크리스트 업데이트 후 다음 단계 진행

### Playwright MCP 테스트 시나리오 필수 항목

- **Happy Path**: 정상 동작 시나리오 (기본 기능 검증)
- **Error Case**: 잘못된 입력/권한 없음/서버 오류 시나리오
- **Edge Case**: 경계값, 빈 데이터, 최대값 시나리오
- **Integration**: 관련 기능 간 연동 시나리오

### ⛔ 테스트 없이 진행 금지 사항

- API 구현 완료 후 테스트 없이 다음 Task 진행 금지
- 테스트 실패 상태에서 ROADMAP 완료 표시 금지
- 부분 테스트만 수행하고 완료 처리 금지
- 테스트 체크리스트 미완성 상태에서 작업 완료 처리 금지

---

## MVP 성공 기준

| 기준                                        | 관련 Task     | 상태      |
| ------------------------------------------- | ------------- | --------- |
| 노션 데이터베이스에서 견적서 정보 정상 조회 | Task 020, 021 | 대기      |
| 고유 URL 접근 시 견적서 웹 표시             | Task 010, 021 | 진행 중   |
| PDF 다운로드 버튼 클릭 시 PDF 다운로드      | Task 023      | 대기      |
| 모바일/태블릿/데스크톱 정상 작동            | Task 012      | 대기      |
| 잘못된 URL 접근 시 적절한 에러 메시지 표시  | Task 022      | 부분 완료 |

---

## 기술 스택 요약

| 분류        | 기술                                    |
| ----------- | --------------------------------------- |
| Framework   | Next.js 15.5.3 (App Router + Turbopack) |
| Runtime     | React 19.1.0 + TypeScript 5             |
| Styling     | TailwindCSS v4 + shadcn/ui (new-york)   |
| Notion 연동 | @notionhq/client                        |
| PDF 생성    | @react-pdf/renderer (또는 Puppeteer)    |
| 배포        | Vercel                                  |
| 환경 변수   | `NOTION_API_KEY`, `NOTION_DATABASE_ID`  |
