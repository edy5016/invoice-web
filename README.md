# 노션 기반 견적서 관리 시스템

노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템입니다.

## 프로젝트 개요

**목적**: 노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템
**사용자**: 견적서를 발행하는 프리랜서/소규모 기업과 견적서를 받는 클라이언트

## 주요 페이지

1. **견적서 조회 페이지** (`/invoice/[notionPageId]`) - 클라이언트가 고유 URL로 견적서를 조회하고 PDF 다운로드
2. **404 에러 페이지** - 존재하지 않는 견적서 접근 시 안내

## 핵심 기능

- 노션 API 연동: Notion 데이터베이스에서 견적서 정보 실시간 조회
- 견적서 웹 뷰어: 발행일, 유효기간, 항목별 금액, 총액 등 표시
- PDF 다운로드: 견적서를 PDF 파일로 변환 및 다운로드
- 반응형 디자인: 모바일/태블릿/데스크톱 지원
- 404 처리: 잘못된 URL 접근 시 친절한 에러 메시지

## 기술 스택

- **Framework**: Next.js 15.5.3 (App Router)
- **Runtime**: React 19 + TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui
- **외부 API**: @notionhq/client (Notion API v1)
- **PDF 생성**: @react-pdf/renderer
- **배포**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 Notion API 키와 데이터베이스 ID를 입력하세요:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxx
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

## Notion 설정

1. [Notion Developers](https://www.notion.so/my-integrations)에서 Integration 생성
2. 견적서 데이터베이스에 Integration 연결
3. `.env.local`에 API 키와 데이터베이스 ID 입력

## 개발 상태

- 기본 프로젝트 구조 설정
- 견적서 조회 페이지 개발 중
- PDF 다운로드 기능 개발 예정
- Notion API 연동 개발 예정

## 문서

- [PRD 문서](./docs/guides/prd.md) - 상세 요구사항
- [개발 로드맵](./docs/ROADMAP.md) - 개발 계획
- [개발 가이드](./CLAUDE.md) - 개발 지침
