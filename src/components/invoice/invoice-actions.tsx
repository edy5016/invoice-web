import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CopyUrlButton } from '@/components/copy-url-button'

interface InvoiceActionsProps {
  invoiceId: string
}

// 견적서 액션 바 컴포넌트 - 하단 sticky 위치
export function InvoiceActions({ invoiceId }: InvoiceActionsProps) {
  // 전체 URL로 생성 (NEXT_PUBLIC_SITE_URL 기준, 없으면 런타임에서 origin 사용)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const invoiceUrl = siteUrl
    ? `${siteUrl}/invoice/${invoiceId}`
    : `/invoice/${invoiceId}`

  return (
    <div className="bg-background sticky bottom-0 border-t py-4">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* 모바일: 세로 배치, 데스크톱: 가로 우측 정렬 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {/* URL 복사 버튼 */}
          <CopyUrlButton url={invoiceUrl} className="w-full sm:w-auto" />

          {/* PDF 다운로드 버튼: aria-label로 동작을 명확히 전달 */}
          <Button asChild className="w-full sm:w-auto">
            <a
              href={`/api/invoice/${invoiceId}/pdf`}
              download
              aria-label="PDF로 다운로드"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              PDF 다운로드
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
