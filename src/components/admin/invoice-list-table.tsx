import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InvoiceStatusBadge } from '@/components/admin/invoice-status-badge'
import { ShareInvoiceButton } from '@/components/admin/share-invoice-button'
import type { InvoiceListItem } from '@/types/invoice'

interface InvoiceListTableProps {
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

// 견적서 목록 테이블 컴포넌트 (데스크톱 전용)
// md 이상 화면에서 표시
export function InvoiceListTable({ items }: InvoiceListTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>견적서 번호</TableHead>
            <TableHead>클라이언트명</TableHead>
            <TableHead>발행일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">금액</TableHead>
            <TableHead className="w-12 text-center">공유</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id} className="group">
              {/* 견적서 번호 (클릭 시 견적서 상세 페이지로 이동) */}
              <TableCell>
                <Link
                  href={`/invoice/${item.id}`}
                  className="text-primary font-medium hover:underline"
                >
                  {item.invoiceNumber}
                </Link>
              </TableCell>
              <TableCell>{item.clientName || '-'}</TableCell>
              <TableCell>{formatDate(item.issueDate)}</TableCell>
              <TableCell>
                <InvoiceStatusBadge status={item.notionStatus} />
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(item.totalAmount)}
              </TableCell>
              {/* 공유 버튼 */}
              <TableCell className="text-center">
                <ShareInvoiceButton
                  invoiceId={item.id}
                  invoiceNumber={item.invoiceNumber}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
