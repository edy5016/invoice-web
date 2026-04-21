import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { InvoiceStatusBadge } from '@/components/admin/invoice-status-badge'
import { CopyInvoiceLinkButton } from '@/components/admin/copy-invoice-link-button'
import type { InvoiceListItem } from '@/types/invoice'

interface InvoiceListCardProps {
  items: InvoiceListItem[]
}

// 금액을 한국 원화 형식으로 포맷
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

// 날짜를 한국 형식으로 포맷
function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

// 견적서 목록 카드 컴포넌트 (모바일 전용)
// md 미만 화면에서 표시
export function InvoiceListCard({ items }: InvoiceListCardProps) {
  return (
    <div className="space-y-3">
      {items.map(item => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="pt-4 pb-2">
            <div className="flex items-center justify-between gap-2">
              {/* 견적서 번호 링크 */}
              <Link
                href={`/invoice/${item.id}`}
                className="text-primary font-semibold hover:underline"
              >
                {item.invoiceNumber}
              </Link>
              <InvoiceStatusBadge status={item.notionStatus} />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">클라이언트</span>
                <span className="font-medium">{item.clientName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">발행일</span>
                <span>{formatDate(item.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">금액</span>
                <span className="font-semibold">
                  {formatCurrency(item.totalAmount)}
                </span>
              </div>
            </div>
            {/* 링크 복사 버튼 */}
            <div className="mt-3 flex justify-end">
              <CopyInvoiceLinkButton invoiceId={item.id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
