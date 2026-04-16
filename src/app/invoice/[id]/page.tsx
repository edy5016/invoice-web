import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FileText, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CopyUrlButton } from '@/components/copy-url-button'

// 페이지 파라미터 타입 정의
interface InvoicePageProps {
  params: Promise<{ id: string }>
}

// 동적 메타데이터 생성 (추후 Notion API 연동 시 실제 데이터 활용)
export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `견적서 ${id}`,
    description: '견적서를 조회하고 PDF로 다운로드하세요.',
  }
}

// 견적서 조회 페이지 (서버 컴포넌트)
// TODO: Notion API 연동 후 실제 데이터로 교체
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params

  // TODO: Notion API로 견적서 데이터 조회
  // const invoice = await getInvoiceFromNotion(id)
  // if (!invoice) notFound()

  // 개발 단계: id가 없는 경우 404 처리
  if (!id) {
    notFound()
  }

  // 현재 페이지 전체 URL (서버에서는 origin을 알 수 없으므로 클라이언트에서 처리)
  const invoicePath = `/invoice/${id}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 바 */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 뒤로가기 + 제목 */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">이용 안내</span>
              </Link>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  견적서
                </span>
                <span className="hidden rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-400 sm:inline">
                  {id}
                </span>
              </div>
            </div>

            {/* 오른쪽: URL 복사 버튼 */}
            <CopyUrlButton url={`${invoicePath}`} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 견적서 메타 정보 */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">견적서</h1>
              <p className="mt-1 text-sm text-gray-500">
                견적서 ID: <span className="font-mono text-gray-700">{id}</span>
              </p>
            </div>
            {/* URL 복사 (모바일용 추가 위치) */}
            <div className="shrink-0">
              <CopyUrlButton url={invoicePath} className="sm:hidden" />
            </div>
          </div>
        </div>

        {/* 견적서 내용 영역 (추후 Notion 데이터로 교체) */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-600">
                Notion API 연동 개발 중
              </p>
              <p className="mt-2 text-sm text-gray-400">
                곧 실제 견적서 내용이 표시됩니다.
              </p>

              {/* 개발 단계 안내 */}
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left">
                <p className="mb-1 text-xs font-medium text-amber-800">
                  개발 진행 상황
                </p>
                <ul className="space-y-1 text-xs text-amber-700">
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    견적서 조회 페이지 구조 완성
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    URL 복사 기능 완성
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                    Notion API 연동 (진행 예정)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                    PDF 생성 및 다운로드 (진행 예정)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액션 영역 */}
        <div className="mt-6 flex items-center justify-between gap-3">
          {/* URL 복사 */}
          <CopyUrlButton url={invoicePath} />

          {/* PDF 다운로드 (추후 활성화) */}
          <button
            disabled
            className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-400"
            title="Notion API 연동 후 활성화됩니다"
          >
            <Download className="h-4 w-4" />
            PDF 다운로드
          </button>
        </div>

        {/* 하단 URL 표시 */}
        <div className="mt-4 rounded-lg bg-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">
            <span className="font-medium">견적서 URL:</span>{' '}
            <span className="font-mono">{invoicePath}</span>
          </p>
        </div>
      </main>
    </div>
  )
}
