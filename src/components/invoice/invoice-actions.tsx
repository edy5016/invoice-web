import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CopyUrlButton } from '@/components/copy-url-button'

interface InvoiceActionsProps {
  invoiceId: string
}

// 견적서 액션 바 컴포넌트 - 하단 sticky 위치
export function InvoiceActions({ invoiceId }: InvoiceActionsProps) {
  const invoicePath = `/invoice/${invoiceId}`

  return (
    <div className="bg-background sticky bottom-0 border-t py-4">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* 모바일: 세로 배치, 데스크톱: 가로 우측 정렬 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {/* URL 복사 버튼 (기존 컴포넌트 재사용) */}
          <CopyUrlButton url={invoicePath} className="w-full sm:w-auto" />

          {/* PDF 다운로드 버튼 - Phase 3에서 활성화 예정 */}
          <Button
            disabled
            className="w-full cursor-not-allowed sm:w-auto"
            title="Phase 3에서 활성화됩니다"
          >
            <Download className="mr-2 h-4 w-4" />
            PDF 다운로드
          </Button>
        </div>
      </div>
    </div>
  )
}
