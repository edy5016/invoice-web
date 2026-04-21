import { FileText } from 'lucide-react'

// 견적서 목록이 비어있을 때 표시하는 빈 상태 컴포넌트
export function InvoiceListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
        <FileText className="text-muted-foreground size-8" />
      </div>
      <h3 className="text-foreground mb-1 text-base font-semibold">
        견적서가 없습니다
      </h3>
      <p className="text-muted-foreground text-sm">
        조건에 해당하는 견적서를 찾을 수 없습니다.
      </p>
    </div>
  )
}
