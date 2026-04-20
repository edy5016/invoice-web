import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

interface InvoiceSummaryProps {
  subtotal: number
  taxRate: number
  taxAmount: number
  totalAmount: number
}

// 견적서 합계 요약 컴포넌트
export function InvoiceSummary({
  subtotal,
  taxRate,
  taxAmount,
  totalAmount,
}: InvoiceSummaryProps) {
  // 세율을 퍼센트로 변환
  const taxRatePercent = Math.round(taxRate * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>금액 요약</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 공급가액 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">공급가액</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {/* 부가세 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              부가세 ({taxRatePercent}%)
            </span>
            <span className="font-medium">{formatCurrency(taxAmount)}</span>
          </div>
          <Separator />
          {/* 최종 합계 - 강조 표시 */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">합계</span>
            <span className="text-xl font-bold">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
