# Development Guidelines (AI Agent 전용)

## Project Overview

- **목적**: 노션 데이터베이스 기반 견적서 관리 시스템 — 고유 URL로 견적서 조회(`/invoice/[notionPageId]`) + PDF 다운로드
- **스택**: Next.js 15.5.3 (App Router + Turbopack) / React 19 / TypeScript 5 / TailwindCSS v4 / shadcn/ui (new-york)
- **경로 별칭**: `@/*` → `./src/*` (항상 사용, 상대경로 금지)
- **외부 의존**: Notion API (`@notionhq/client`), PDF 생성 라이브러리 (미선정)

---

## Current Implementation State

| 파일                                 | 상태          | 설명                                          |
| ------------------------------------ | ------------- | --------------------------------------------- |
| `src/app/layout.tsx`                 | 구현됨        | 루트 레이아웃 (Geist 폰트, 한국어 메타데이터) |
| `src/app/page.tsx`                   | 구현됨        | 이용 안내 홈페이지 (3단계 가이드)             |
| `src/app/not-found.tsx`              | 구현됨        | 전역 404 페이지                               |
| `src/app/globals.css`                | 구현됨        | TailwindCSS v4 테마 + CSS 변수                |
| `src/app/invoice/[id]/page.tsx`      | 구현됨 (더미) | 견적서 조회 UI, Notion 미연동                 |
| `src/components/copy-url-button.tsx` | 구현됨        | URL 복사 버튼 (Client Component)              |
| `src/components/ui/`                 | 구현됨        | shadcn/ui 18개 컴포넌트                       |
| `src/lib/utils.ts`                   | 구현됨        | cn() 헬퍼                                     |
| `src/lib/env.ts`                     | 구현됨        | 환경변수 Zod 스키마                           |
| `src/lib/notion.ts`                  | **미구현**    | Notion 클라이언트 (여기 생성 예정)            |
| `src/app/api/generate-pdf/route.ts`  | **미구현**    | PDF 생성 API Route (여기 생성 예정)           |

---

## Directory Structure Rules

### 파일 배치 기준

- 새 페이지 → `src/app/<경로>/page.tsx`
- 견적서 비즈니스 컴포넌트 → `src/components/invoice/` 하위
- 공용 커스텀 컴포넌트 → `src/components/<이름>.tsx`
- shadcn/ui 전용 → `src/components/ui/` (CLI로만 추가, 직접 수정 금지)
- Context Provider → `src/components/providers/`
- 유틸리티 함수 → `src/lib/<이름>.ts`
- 타입 정의 → `src/lib/types/` 또는 `src/types/`
- API Route → `src/app/api/[feature]/route.ts`

### 파일명 규칙

- 파일: **kebab-case** 필수 (`invoice-detail.tsx` O, `InvoiceDetail.tsx` X)
- 컴포넌트 함수명: **PascalCase** 필수 (`export function InvoiceDetail()`)
- 훅 파일: `use-` 접두사 kebab-case (`use-invoice.ts`)
- 하나의 파일 300줄 초과 시 분할 필수

---

## Key File Interaction Rules

### Notion API 연동 시

1. `src/lib/notion.ts` 생성 (Notion 클라이언트 + 조회 함수)
2. `src/lib/env.ts`의 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 이미 정의됨 — 추가 불필요
3. `src/app/invoice/[id]/page.tsx`의 TODO 부분을 실제 Notion 조회로 교체
4. `docs/ROADMAP.md` 해당 태스크 완료 체크

### PDF 기능 추가 시

1. `src/app/api/generate-pdf/route.ts` 생성
2. `src/app/invoice/[id]/page.tsx`의 PDF 버튼(`disabled`) 활성화
3. `docs/ROADMAP.md` 해당 태스크 완료 체크

### 환경변수 추가 시

- `src/lib/env.ts`의 `envSchema`에 Zod 스키마 추가
- `.env.example`에 동일 변수 추가 (값은 빈 문자열 또는 예시값)

### shadcn 컴포넌트 추가 시

1. `npx shadcn@latest add [name]` 실행
2. `src/components/ui/`에 자동 생성 확인
3. `components.json` 자동 업데이트 확인

### ROADMAP 업데이트

- 기능 완료 시 `docs/ROADMAP.md` 체크박스 업데이트 필수

---

## Component Rules

### Server vs Client 컴포넌트

- **기본값**: Server Component (async 함수, 데이터 패칭 가능)
- **'use client' 추가 조건**: useState, useEffect, onClick, onChange 등 클라이언트 훅/이벤트 사용 시만
- `'use client'` 선언은 파일 최상단 첫 줄에 배치
- Notion 데이터 조회는 반드시 Server Component에서 수행

```tsx
// ✅ Server Component (기본)
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params // Next.js 15: params는 Promise
  // ...
}

// ✅ Client Component (상호작용 필요시만)
;('use client')
export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  // ...
}
```

### Next.js 15 필수 규칙

- `params`, `searchParams`, `cookies`, `headers`는 **모두 Promise** → 반드시 `await` 사용
- `generateMetadata`에서도 동일하게 `await params` 사용
- `loading.tsx` / `error.tsx`로 Suspense/Error Boundary 처리
- `after()` API: 응답 후 실행할 비차단 작업에 사용

```tsx
// ✅ 올바름
const { id } = await params

// ❌ 금지 - Promise를 await 없이 사용
const { id } = params
```

### Props 타입

- 모든 컴포넌트에 TypeScript interface로 Props 명시
- `className?: string` props 지원 시 `cn()` 함수로 병합

---

## Styling Rules

### TailwindCSS v4

- **모든 스타일은 Tailwind 클래스로** (인라인 `style={{}}` 금지)
- CSS 변수는 `src/app/globals.css`에만 정의 (별도 CSS 파일 생성 금지)
- `tailwind.config.ts` 파일 **생성 금지** (v4는 CSS 기반 설정)
- 클래스 순서: prettier-plugin-tailwindcss가 자동 정렬 → 수동 정렬 불필요
- 반응형: mobile-first (`sm:` → `md:` → `lg:` 순서)
- 다크모드: `dark:` prefix 사용
- 신규 컴포넌트: `bg-background`, `text-foreground` 등 시맨틱 CSS 변수 사용

```tsx
// ✅ 올바름
<div className={cn("flex flex-col gap-4 p-6 text-foreground bg-background", className)}>

// ❌ 금지
<div style={{ display: 'flex', padding: '24px' }}>
```

### shadcn/ui 컴포넌트

- 추가: `npx shadcn@latest add <component>` 명령어만 사용
- `src/components/ui/` 파일 **직접 편집 금지**
- 커스터마이징 필요 시: 래퍼 컴포넌트를 `src/components/`에 생성 후 `className` prop 확장

---

## TypeScript Rules

- `any` 타입 **완전 금지** → `unknown` 또는 구체적 타입 사용
- `as` 타입 단언 최소화 (불가피한 경우에만)
- Zod 스키마로 외부 데이터(Notion API, 환경변수) 유효성 검사 필수
- 컴포넌트 Props는 interface로 정의

```tsx
// ✅ 올바름
interface InvoicePageProps {
  params: Promise<{ id: string }>
}

// ❌ 금지
const data = response as any
```

---

## Environment Variable Rules

- **`process.env.*` 직접 접근 금지** → 반드시 `src/lib/env.ts`의 `env` 객체 사용

```typescript
// ✅ 올바름
import { env } from '@/lib/env'
const client = new Client({ auth: env.NOTION_API_KEY })

// ❌ 금지
const client = new Client({ auth: process.env.NOTION_API_KEY })
```

---

## Notion API Integration Rules

- Notion 클라이언트: `src/lib/notion.ts`에 싱글톤으로 생성
- 페이지 조회: `notion.pages.retrieve({ page_id: id })`
- 블록 조회: `notion.blocks.children.list({ block_id: id })`
- 존재하지 않는 페이지: `notFound()` 호출 (Next.js `next/navigation`)
- API 에러: try/catch로 처리 후 적절한 에러 상태 반환
- 환경변수: `env.NOTION_API_KEY`, `env.NOTION_DATABASE_ID` 사용

---

## Import Rules

- 경로 별칭 **필수** 사용 (상대경로 `../` 금지)
  - `@/components/...`
  - `@/lib/...`
  - `@/components/ui/...`
- import 순서: 외부 라이브러리 → 내부 `@/` 경로

---

## Workflow Rules

### 커밋 전 필수 체크

```bash
npm run check-all  # typecheck + lint + format:check 통합 실행 (반드시 통과)
npm run build      # 프로덕션 빌드 성공 확인
```

### 새 기능 추가 절차

1. `docs/ROADMAP.md`에서 해당 태스크 확인
2. `docs/guides/` 관련 가이드 참조
3. 기존 패턴 따라 구현
4. `npm run check-all` 통과 확인
5. `docs/ROADMAP.md` 진행 상태 업데이트

---

## AI Decision Rules

### 컴포넌트 위치 결정

```
데이터 패칭 필요? → Server Component (src/app 또는 src/components)
사용자 상호작용 필요? → Client Component ('use client')
shadcn/ui 래핑 필요? → src/components/<이름>.tsx
견적서 비즈니스 로직? → src/components/invoice/
```

### 스타일 적용 결정

```
기존 shadcn 컴포넌트로 가능? → 그대로 사용
커스터마이징 필요? → 래퍼 컴포넌트 생성 (ui 파일 직접 수정 금지)
새 디자인 토큰 필요? → globals.css CSS 변수 추가
```

### 불명확한 상황 처리 기준

- Server/Client 불명확 → Server Component 우선
- 파일 위치 불명확 → `src/lib/` (유틸) 또는 `src/components/invoice/` (UI)
- 색상 선택 불명확 → 시맨틱 변수(`bg-background`, `text-foreground`) 우선

---

## Prohibited Actions

| 금지 행동                              | 대안                                |
| -------------------------------------- | ----------------------------------- |
| `process.env.*` 직접 접근              | `src/lib/env.ts`의 `env` 객체 사용  |
| `src/components/ui/` 직접 편집         | `npx shadcn@latest add` 사용        |
| `tailwind.config.ts` 생성              | `globals.css`에 CSS 변수로 정의     |
| `any` 타입 사용                        | `unknown` 또는 구체적 타입          |
| `params` await 없이 사용               | `const { id } = await params`       |
| 인라인 `style={{}}` 사용               | Tailwind 클래스 사용                |
| 상대경로 import (`../`)                | `@/` 별칭 사용                      |
| 하나 파일에 300줄 초과                 | 컴포넌트/모듈 분할                  |
| `'use client'` 남용                    | 실제 클라이언트 훅/이벤트 필요 시만 |
| shadcn 컴포넌트 수동 복붙              | CLI 명령어 사용                     |
| Notion API를 Client Component에서 호출 | Server Component/Action에서만       |
| `npm run check-all` 미실행             | 커밋 전 반드시 실행                 |
| `docs/ROADMAP.md` 업데이트 누락        | 기능 완료 후 반드시 체크            |
