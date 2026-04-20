import type { Invoice, InvoiceStatus } from '@/types/invoice'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CalendarDays, Hash } from 'lucide-react'

// 상태별 Badge variant 매핑
function getStatusVariant(
  status: InvoiceStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variantMap: Record<
    InvoiceStatus,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    active: 'default',
    draft: 'secondary',
    expired: 'destructive',
    cancelled: 'outline',
  }
  return variantMap[status]
}

// 상태 한국어 표시 텍스트
function getStatusLabel(status: InvoiceStatus): string {
  const labelMap: Record<InvoiceStatus, string> = {
    active: '유효',
    draft: '초안',
    expired: '만료',
    cancelled: '취소',
  }
  return labelMap[status]
}

interface InvoiceHeaderProps {
  invoice: Invoice
}

// 견적서 헤더 컴포넌트 - 번호, 제목, 상태, 날짜 표시
export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const { invoiceNumber, title, status, issueDate, dueDate } = invoice

  // 날짜를 한국어 형식으로 포맷
  const formattedIssueDate = new Date(issueDate).toLocaleDateString('ko-KR')
  const formattedDueDate = new Date(dueDate).toLocaleDateString('ko-KR')

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          {/* 견적서 번호 */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4" />
            <span className="font-mono">{invoiceNumber}</span>
          </div>
          {/* 상태 배지 */}
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        </div>
        {/* 견적서 제목 */}
        <h1 className="mt-2 text-2xl leading-tight font-bold">{title}</h1>
      </CardHeader>
      <CardContent>
        {/* 발행일 및 유효기간 */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="text-muted-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>발행일:</span>
            <span className="text-foreground font-medium">
              {formattedIssueDate}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>유효기간:</span>
            <span className="text-foreground font-medium">
              {formattedDueDate}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
