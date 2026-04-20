import type { Metadata } from 'next'
import { FileText, Search, Download, Link } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export const metadata: Metadata = {
  title: '견적서 조회 시스템 - 이용 안내',
  description: '견적서 URL을 통해 견적서를 조회하고 PDF로 다운로드하세요.',
}

// 루트 페이지: 견적서 서비스 이용 가이드 페이지
export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* 헤더 */}
      <header className="bg-card border-b">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-foreground text-xl font-bold">
                  견적서 조회 시스템
                </h1>
                <p className="text-muted-foreground text-sm">
                  Notion 기반 견적서 관리
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* 소개 섹션 */}
        <div className="mb-10 text-center">
          <h2 className="text-foreground text-2xl font-bold">이용 안내</h2>
          <p className="text-muted-foreground mt-2">
            담당자로부터 전달받은 견적서 URL로 접속하여 견적서를 확인하고 PDF로
            저장하세요.
          </p>
        </div>

        {/* 3단계 가이드 */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* 1단계: 견적서 조회 방법 */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                1
              </span>
              <h3 className="text-foreground font-semibold">견적서 조회</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              담당자로부터 전달받은 견적서 고유 URL로 접속합니다. URL 형식은
              아래와 같습니다.
            </p>
            <div className="bg-muted mt-4 rounded-md border px-3 py-2">
              <p className="text-muted-foreground font-mono text-xs break-all">
                /invoice/<span className="text-blue-600">견적서ID</span>
              </p>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              예시: /invoice/abc123def456
            </p>
          </div>

          {/* 2단계: 견적서 확인 */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                2
              </span>
              <h3 className="text-foreground font-semibold">견적서 확인</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              페이지에서 견적서의 상세 내용을 확인합니다.
            </p>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                회사명 및 담당자 정보
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                견적 항목 및 수량
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                단가 및 공급가액
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                부가세 및 합계 금액
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                견적 유효 기간
              </li>
            </ul>
          </div>

          {/* 3단계: PDF 다운로드 */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                3
              </span>
              <h3 className="text-foreground font-semibold">PDF 다운로드</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              견적서 페이지 하단의 <strong>PDF 다운로드</strong> 버튼을 클릭하면
              견적서가 PDF 파일로 저장됩니다.
            </p>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500"></span>
                A4 규격 PDF 출력
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500"></span>
                인쇄 및 보관 가능
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500"></span>
                모바일에서도 지원
              </li>
            </ul>
          </div>
        </div>

        {/* URL 복사 안내 */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/50">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Link className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                견적서 URL 공유
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                견적서 페이지에서 <strong>URL 복사</strong> 버튼을 클릭하면
                견적서 링크를 클립보드에 복사할 수 있습니다. 복사한 URL을
                이메일이나 메신저로 공유하세요.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm text-blue-700 shadow-sm dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Link className="h-3.5 w-3.5" />
                  URL 복사
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  ← 견적서 페이지 상단에 표시됩니다
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 문의 안내 */}
        <div className="bg-muted mt-6 rounded-lg px-6 py-4 text-center">
          <p className="text-muted-foreground text-sm">
            견적서 URL이 없거나 접속이 되지 않는 경우, 견적서를 발송한
            담당자에게 문의해주세요.
          </p>
        </div>
      </main>
    </div>
  )
}
