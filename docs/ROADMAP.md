# 노션 기반 견적서 관리 시스템 개발 로드맵

노션 데이터베이스를 활용해 견적서를 관리하고, 클라이언트가 고유 URL로 조회 및 PDF 다운로드할 수 있는 웹 서비스

## 개요

invoice-web은 프리랜서/소규모 기업을 위한 노션 기반 견적서 관리 시스템으로 다음 기능을 제공합니다:

- **견적서 조회**: 고유 URL(`/invoice/[notionPageId]`)로 견적서 내용을 웹에서 즉시 확인
- **PDF 다운로드**: 견적서를 A4 규격 PDF 파일로 변환 및 다운로드
- **URL 공유**: 견적서 링크를 클립보드 복사로 이메일/메신저로 손쉽게 공유
- **관리자 대시보드**: 견적서 목록을 한눈에 조회하고 클라이언트 공유 링크를 빠르게 복사 (Phase 5 신규)

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

### Phase 5: 관리자 대시보드 및 링크 공유 고도화

MVP 이후 고도화 단계로, 관리자가 견적서를 효율적으로 관리하고 클라이언트 공유 링크를 빠르게 배포할 수 있는 관리자 페이지를 구축합니다.

- **Task 040: 관리자 라우트 구조 및 레이아웃 골격 구현** - 우선순위
  - `app/admin/layout.tsx` - 관리자 전용 레이아웃 (사이드바, 상단 헤더, 컨텐츠 영역)
  - `app/admin/page.tsx` - 대시보드 진입 페이지 (견적서 목록으로 리다이렉트 또는 요약 카드)
  - `app/admin/invoices/page.tsx` - 견적서 목록 페이지 골격 (빈 상태)
  - `src/components/admin/admin-sidebar.tsx` - 관리자 네비게이션 사이드바
  - `src/components/admin/admin-header.tsx` - 관리자 상단 헤더 (로고, 프로필 영역)
  - 루트 레이아웃과 독립된 관리자 레이아웃 분리 (Route Group 활용 검토)
  - **수락 기준**:
    - `/admin` 경로 접근 시 관리자 전용 레이아웃 렌더링
    - 사이드바 네비게이션으로 `/admin/invoices` 이동 가능
    - 모바일/데스크톱 반응형 사이드바 (햄버거 메뉴)
  - See: `/tasks/040-admin-layout.md`

- **Task 041: 관리자 접근 제어 및 기본 인증 구현**
  - `middleware.ts` - `/admin/*` 경로에 대한 접근 제어 미들웨어
  - 환경 변수 기반 간단한 Basic Auth 또는 관리자 키 기반 접근 제어
    - `ADMIN_ACCESS_KEY` 환경 변수 스키마 추가
    - 쿠키 또는 헤더 기반 세션 검증
  - `app/admin/login/page.tsx` - 관리자 로그인 페이지 (비밀번호 입력 폼)
  - `app/api/admin/auth/route.ts` - 인증 처리 API Route Handler
  - Server Action 기반 로그인 처리 및 세션 쿠키 발급
  - **수락 기준**:
    - 인증되지 않은 사용자가 `/admin/*` 접근 시 `/admin/login`으로 리다이렉트
    - 올바른 키/비밀번호 입력 시 `/admin/invoices`로 이동
    - 잘못된 키 입력 시 에러 메시지 표시
  - **Playwright MCP 테스트 시나리오**:
    - Happy Path: 올바른 키 입력 → 관리자 페이지 진입
    - Error Case: 잘못된 키 / 빈 키 입력 시 에러 표시
    - Edge Case: 인증 쿠키 없이 `/admin/invoices` 직접 접근 시 로그인 페이지 리다이렉트
  - See: `/tasks/041-admin-auth.md`

- **Task 042: 견적서 목록 조회 API 및 데이터 레이어 구현**
  - `src/lib/notion-invoice-list.ts` - 견적서 목록 조회 함수
    - `getInvoiceList({ page, pageSize, status, sort })` - 페이지네이션/필터 지원
    - Notion Database Query API (`databases.query`) 활용
    - `start_cursor`, `page_size`, `filter`, `sorts` 파라미터 매핑
    - 응답 데이터 → `InvoiceListItem[]` 타입 변환 (목록 전용 경량 타입)
  - `src/types/invoice.ts` - 신규 타입 추가
    - `InvoiceListItem`: 번호, 클라이언트명, 발행일, 상태, 합계 금액, 페이지 ID
    - `InvoiceListResponse`: `{ items, nextCursor, hasMore, total }`
    - `InvoiceListFilter`: 상태별 필터 옵션 타입
  - `unstable_cache` 적용 (revalidate: 60, tags: ['invoice-list'])
  - **수락 기준**:
    - 노션 데이터베이스에서 견적서 목록 정상 조회 (최대 100건/페이지)
    - 상태별 필터링(대기/승인/거절) 정상 동작
    - 발행일 내림차순 정렬 기본 적용
  - **Playwright MCP 테스트 시나리오**:
    - Happy Path: 목록 API 호출 → 정상 응답 (items 배열, nextCursor)
    - Error Case: Notion 토큰 오류(401) → 에러 응답 반환
    - Edge Case: 빈 데이터베이스 → 빈 배열 반환, 필터 조건 무결과 시 UI 처리
  - See: `/tasks/042-invoice-list-api.md`

- **Task 043: 견적서 목록 UI 구현 (테이블/카드 뷰)**
  - `app/admin/invoices/page.tsx` - Server Component로 목록 렌더링
  - `src/components/admin/invoice-list-table.tsx` - 데스크톱 테이블 뷰
    - 컬럼: 견적서 번호, 클라이언트명, 발행일, 상태 배지, 합계 금액, 액션
    - shadcn/ui Table 컴포넌트 기반
  - `src/components/admin/invoice-list-card.tsx` - 모바일 카드 뷰 (768px 미만)
  - `src/components/admin/invoice-list-empty.tsx` - 빈 상태 UI (견적서 없음)
  - `app/admin/invoices/loading.tsx` - Skeleton 로딩 상태
  - `app/admin/invoices/error.tsx` - 에러 경계 컴포넌트
  - 금액 통화 포맷팅 (`Intl.NumberFormat('ko-KR')`)
  - 날짜 포맷팅 (`toLocaleDateString('ko-KR')`)
  - **수락 기준**:
    - 데스크톱에서 테이블 형태로 견적서 목록 표시
    - 모바일에서 카드 형태로 동일 데이터 표시
    - 상태 배지 색상 구분 (대기: gray, 승인: green, 거절: red)
    - 각 행 클릭 시 `/invoice/[id]` 상세 페이지로 이동
  - **Playwright MCP 테스트 시나리오**:
    - Happy Path: 목록 페이지 진입 → 테이블/카드 렌더링 확인
    - Error Case: API 오류 발생 시 error boundary UI 표시
    - Edge Case: 빈 목록 / 긴 클라이언트명 / 초고액(10억 이상) 포맷팅 검증
  - See: `/tasks/043-invoice-list-ui.md`

- **Task 044: 페이지네이션 및 상태 필터링 구현**
  - `src/components/admin/invoice-list-pagination.tsx` - 페이지네이션 UI
    - `useSearchParams` 기반 URL 쿼리 동기화 (`?page=2&status=pending`)
    - 이전/다음 버튼 및 페이지 번호 표시
  - `src/components/admin/invoice-list-filter.tsx` - 상태 필터 드롭다운/탭
    - 전체 / 대기 / 승인 / 거절 탭
    - shadcn/ui Tabs 또는 Select 컴포넌트 활용
  - Server Component 내 `searchParams` 수신 후 필터/페이지 반영
  - 옵션: 무한 스크롤 전환 (`IntersectionObserver` + Client Component)
  - **수락 기준**:
    - URL 쿼리로 현재 페이지/필터 상태 공유 가능
    - 필터 변경 시 목록 즉시 재조회 및 페이지 1로 리셋
    - 브라우저 뒤로가기로 이전 필터 상태 복원 가능
  - **Playwright MCP 테스트 시나리오**:
    - Happy Path: 페이지 이동 → URL 변경 및 데이터 갱신 확인
    - Error Case: 잘못된 쿼리 파라미터(`page=-1`, `status=invalid`) 방어 처리
    - Edge Case: 마지막 페이지에서 다음 버튼 비활성화, 단일 페이지일 때 페이지네이션 숨김
  - See: `/tasks/044-pagination-filter.md`

- **Task 045: 링크 공유 기능 구현 (클립보드 복사 + 토스트)**
  - `src/components/admin/copy-invoice-link-button.tsx` - 링크 복사 클라이언트 컴포넌트
    - 견적서 공개 URL 생성 (`${NEXT_PUBLIC_SITE_URL}/invoice/${id}`)
    - `navigator.clipboard.writeText` 활용
    - 복사 성공/실패 상태 관리
  - shadcn/ui `sonner` 또는 `toast` 컴포넌트 설치 및 적용
  - `src/components/ui/toaster.tsx` - 전역 토스트 프로바이더
  - `app/admin/layout.tsx`에 Toaster 마운트
  - 목록 테이블/카드 각 행에 "링크 복사" 버튼 추가 (Lucide `Copy` 아이콘)
  - HTTPS 미지원 환경 대비 `document.execCommand('copy')` 폴백
  - 접근성: `aria-label="견적서 링크 복사"`, `aria-live="polite"` 피드백
  - **수락 기준**:
    - 각 견적서 행의 "링크 복사" 버튼 클릭 시 클립보드에 공개 URL 저장
    - 복사 성공 시 토스트 "링크가 복사되었습니다" 표시
    - 복사 실패 시 토스트 "복사에 실패했습니다" + 수동 복사용 URL 표시
  - **Playwright MCP 테스트 시나리오**:
    - Happy Path: 복사 버튼 클릭 → 클립보드 내용 확인 → 토스트 표시 검증
    - Error Case: 클립보드 API 차단 환경에서 폴백 동작 및 에러 토스트 확인
    - Edge Case: 연속 클릭 시 토스트 중복 방지, 다른 행 복사 시 이전 상태 초기화
  - See: `/tasks/045-link-share.md`

- **Task 046: 관리자 대시보드 통합 테스트 및 최적화**
  - Playwright MCP를 활용한 전체 관리자 플로우 E2E 테스트
    - 로그인 → 목록 조회 → 필터링 → 페이지네이션 → 링크 복사 → 상세 이동
  - 목록 조회 시 Notion API 호출 수 최적화 검증 (캐싱 적중률 모니터링)
  - 대량 데이터(100건+) 렌더링 성능 측정 및 가상 스크롤 적용 검토
  - 접근성 감사 (키보드 네비게이션, 스크린 리더, 색 대비)
  - 모바일 UX 최종 점검 (사이드바 열기/닫기, 카드 뷰 스크롤)
  - `app/admin/invoices/actions.ts` - 필요 시 Server Action 기반 재검증 처리
    - `revalidateTag('invoice-list')` 호출로 캐시 무효화
  - **수락 기준**:
    - 관리자 전체 플로우 E2E 테스트 100% 통과
    - 목록 페이지 LCP < 2.5초 (Vercel 배포 환경)
    - Lighthouse Accessibility 점수 95점 이상
  - **Playwright MCP 테스트 시나리오**:
    - Happy Path: 로그인부터 링크 공유까지 end-to-end 전체 플로우
    - Error Case: 세션 만료 중 목록 조회 시 로그인 페이지 리다이렉트
    - Edge Case: 100건 이상 대량 데이터에서 스크롤/페이지네이션 동작
  - See: `/tasks/046-admin-integration-test.md`

---

## 🧪 Playwright MCP 테스트 의무 실행 가이드

### 테스트 실행 시점 (절대 규칙)

| 작업 유형           | 테스트 시점             | 테스트 도구    |
| ------------------- | ----------------------- | -------------- |
| API 엔드포인트 구현 | 각 엔드포인트 구현 직후 | Playwright MCP |
| 비즈니스 로직 구현  | 각 로직 구현 직후       | Playwright MCP |
| UI 컴포넌트 구현    | 페이지 완성 후          | Playwright MCP |
| Notion API 연동     | 각 기능 구현 직후       | Playwright MCP |
| 인증/권한 시스템    | 각 기능 구현 직후       | Playwright MCP |

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

| 기준                                        | 관련 Task     | 상태    |
| ------------------------------------------- | ------------- | ------- |
| 노션 데이터베이스에서 견적서 정보 정상 조회 | Task 020, 021 | ✅ 완료 |
| 고유 URL 접근 시 견적서 웹 표시             | Task 010, 021 | ✅ 완료 |
| PDF 다운로드 버튼 클릭 시 PDF 다운로드      | Task 023      | ✅ 완료 |
| 모바일/태블릿/데스크톱 정상 작동            | Task 012      | ✅ 완료 |
| 잘못된 URL 접근 시 적절한 에러 메시지 표시  | Task 022      | ✅ 완료 |

---

## Phase 5 고도화 성공 기준

| 기준                                                 | 관련 Task     | 상태    |
| ---------------------------------------------------- | ------------- | ------- |
| 관리자 전용 레이아웃 및 네비게이션 제공              | Task 040      | ✅ 완료 |
| 인증되지 않은 사용자의 관리자 페이지 접근 차단       | Task 041      | ✅ 완료 |
| 노션 데이터베이스 전체 견적서 목록 조회 및 페이징    | Task 042, 044 | ✅ 완료 |
| 견적서 목록 테이블/카드 뷰 및 상태 필터링            | Task 043, 044 | ✅ 완료 |
| 견적서 링크 클립보드 복사 및 토스트 피드백           | Task 045      | ✅ 완료 |
| 관리자 전체 플로우 E2E 테스트 통과 및 성능 기준 충족 | Task 046      | ✅ 완료 |

---

## 기술 스택 요약

| 분류          | 기술                                                                               |
| ------------- | ---------------------------------------------------------------------------------- |
| Framework     | Next.js 15.5.3 (App Router + Turbopack)                                            |
| Runtime       | React 19.1.0 + TypeScript 5                                                        |
| Styling       | TailwindCSS v4 + shadcn/ui (new-york)                                              |
| Notion 연동   | @notionhq/client                                                                   |
| PDF 생성      | @react-pdf/renderer                                                                |
| 토스트/피드백 | shadcn/ui sonner (Phase 5 신규)                                                    |
| 인증          | Next.js Middleware + 쿠키 기반 Basic Auth (Phase 5 신규)                           |
| 배포          | Vercel                                                                             |
| 환경 변수     | `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `ADMIN_ACCESS_KEY`, `NEXT_PUBLIC_SITE_URL` |
