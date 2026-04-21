import { Badge } from '@/components/ui/badge'

interface InvoiceStatusBadgeProps {
  status: string
}

// 상태값 → 배지 색상 매핑
function getStatusVariant(
  status: string
): 'secondary' | 'destructive' | 'default' | 'outline' {
  const map: Record<
    string,
    'secondary' | 'destructive' | 'default' | 'outline'
  > = {
    대기: 'secondary',
    취소: 'destructive',
  }
  return map[status] ?? 'secondary'
}

// 상태 배지 컴포넌트
// Notion 상태값(대기, 확정, 취소 등)에 따라 색상이 다른 배지를 렌더링
export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const variant = getStatusVariant(status)

  // 확정 상태는 shadcn 기본 variant에 없으므로 className으로 직접 처리
  if (status === '확정') {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        {status}
      </Badge>
    )
  }

  return <Badge variant={variant}>{status || '알 수 없음'}</Badge>
}
