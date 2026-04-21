import { Badge } from '@/components/ui/badge'

interface InvoiceStatusBadgeProps {
  status: string
}

// 상태값 → 배지 색상 매핑
// 상태 배지 컴포넌트
// Notion 상태값에 따라 색상이 다른 배지를 렌더링
export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  if (status === '승일' || status === 'Complete') {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        {status}
      </Badge>
    )
  }
  if (status === '거절') {
    return <Badge variant="destructive">{status}</Badge>
  }
  if (status === 'In progress') {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        {status}
      </Badge>
    )
  }
  return <Badge variant="secondary">{status || '알 수 없음'}</Badge>
}
