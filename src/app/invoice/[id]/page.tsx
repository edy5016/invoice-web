import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CopyUrlButton } from '@/components/copy-url-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { getInvoiceById } from '@/lib/mock-data'
import { InvoiceHeader } from '@/components/invoice/invoice-header'
import { InvoiceParties } from '@/components/invoice/invoice-parties'
import { InvoiceItemsTable } from '@/components/invoice/invoice-items-table'
import { InvoiceSummary } from '@/components/invoice/invoice-summary'
import { InvoiceActions } from '@/components/invoice/invoice-actions'

// 페이지 파라미터 타입 정의
interface InvoicePageProps {
  params: Promise<{ id: string }>
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { id } = await params
  const invoice = getInvoiceById(id)

  if (!invoice) {
    return {
      title: '견적서를 찾을 수 없음',
    }
  }

  return {
    title: `${invoice.invoiceNumber} - ${invoice.title}`,
    description: '견적서를 조회하고 PDF로 다운로드하세요.',
  }
}

// 견적서 조회 페이지 (서버 컴포넌트)
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params
  const invoice = getInvoiceById(id)

  // 견적서를 찾지 못하면 404 처리
  if (!invoice) {
    notFound()
  }

  const invoicePath = `/invoice/${id}`

  return (
    <div className="bg-background min-h-screen">
      {/* 상단 네비게이션 바 */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* 왼쪽: 뒤로가기 + 제목 */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">이용 안내</span>
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <div className="flex items-center gap-2">
                <FileText className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">견적서</span>
                <span className="bg-muted text-muted-foreground hidden rounded px-1.5 py-0.5 font-mono text-xs sm:inline">
                  {invoice.invoiceNumber}
                </span>
              </div>
            </div>

            {/* 오른쪽: 테마 토글 + URL 복사 버튼 */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <CopyUrlButton url={invoicePath} />
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* 견적서 헤더 (번호, 제목, 상태, 날짜) */}
          <InvoiceHeader invoice={invoice} />

          {/* 공급자 및 클라이언트 정보 */}
          <InvoiceParties supplier={invoice.supplier} client={invoice.client} />

          {/* 견적 항목 테이블 */}
          <InvoiceItemsTable items={invoice.items} />

          {/* 금액 요약 */}
          <InvoiceSummary
            subtotal={invoice.subtotal}
            taxRate={invoice.taxRate}
            taxAmount={invoice.taxAmount}
            totalAmount={invoice.totalAmount}
          />

          {/* 비고 (있는 경우만 표시) */}
          {invoice.notes && (
            <div className="bg-muted/50 text-muted-foreground rounded-lg border p-4 text-sm">
              <p className="text-foreground mb-1 font-semibold">비고</p>
              <p>{invoice.notes}</p>
            </div>
          )}
        </div>
      </main>

      {/* 하단 sticky 액션 바 */}
      <InvoiceActions invoiceId={id} />
    </div>
  )
}
