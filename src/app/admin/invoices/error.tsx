'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminInvoicesErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// 견적서 목록 에러 바운더리
// Next.js 요구사항에 따라 클라이언트 컴포넌트로 구현
export default function AdminInvoicesError({
  error,
  reset,
}: AdminInvoicesErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-destructive/10 mb-4 flex size-16 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive size-8" />
      </div>
      <h3 className="text-foreground mb-1 text-base font-semibold">
        데이터를 불러오지 못했습니다
      </h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {error.message || '견적서 목록을 불러오는 중 오류가 발생했습니다.'}
      </p>
      <Button onClick={reset} variant="outline">
        다시 시도
      </Button>
    </div>
  )
}
