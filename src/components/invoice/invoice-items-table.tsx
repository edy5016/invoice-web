import type { InvoiceItem } from '@/types/invoice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface InvoiceItemsTableProps {
  items: InvoiceItem[]
}

// 견적서 항목 테이블 컴포넌트 (데스크톱/모바일 반응형)
export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  // 소계 계산
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>견적 항목</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 데스크톱 테이블 뷰 */}
        <div className="hidden md:block">
          {/* aria-label: 스크린리더에서 테이블 용도를 명확히 전달 */}
          <table className="w-full text-sm" aria-label="견적 항목 목록">
            <thead>
              <tr className="border-b">
                {/* scope="col": 각 헤더가 열 방향 헤더임을 명시 */}
                <th
                  scope="col"
                  className="text-muted-foreground pb-3 text-left font-semibold"
                >
                  항목명
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground pb-3 text-right font-semibold"
                >
                  수량
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground pb-3 text-right font-semibold"
                >
                  단가
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground pb-3 text-right font-semibold"
                >
                  금액
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{item.name}</td>
                  <td className="text-muted-foreground py-3 text-right">
                    {item.quantity}
                  </td>
                  <td className="text-muted-foreground py-3 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-3 text-right font-medium">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* 소계 행 */}
            <tfoot>
              <tr className="border-t">
                <td
                  colSpan={3}
                  className="text-muted-foreground pt-3 text-right text-sm"
                >
                  소계
                </td>
                <td className="pt-3 text-right font-semibold">
                  {formatCurrency(subtotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 모바일 카드 뷰 */}
        {/* role="list": 카드 목록을 리스트로 명시하여 스크린리더에서 목록 구조 전달 */}
        <div
          className="block space-y-3 md:hidden"
          role="list"
          aria-label="견적 항목 목록"
        >
          {items.map(item => (
            <div
              key={item.id}
              className="rounded-lg border p-3"
              role="listitem"
            >
              {/* 항목명 */}
              <p className="font-medium">{item.name}</p>
              {/* 수량 × 단가 = 금액 */}
              <div className="text-muted-foreground mt-1.5 flex items-center justify-between text-sm">
                <span>
                  {item.quantity}개 × {formatCurrency(item.unitPrice)}
                </span>
                <span className="text-foreground font-semibold">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          ))}
          {/* 모바일 소계 */}
          <div className="flex items-center justify-between border-t pt-3 text-sm">
            <span className="text-muted-foreground">소계</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
