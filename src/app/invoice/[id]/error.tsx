'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// 견적서 페이지 에러 바운더리 (클라이언트 컴포넌트 필수)
export default function InvoiceError({ error, reset }: ErrorProps) {
  // 에러 로깅
  useEffect(() => {
    console.error('견적서 페이지 오류:', error)
  }, [error])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류가 발생했습니다</AlertTitle>
          <AlertDescription>
            견적서를 불러오는 중 문제가 발생했습니다.
            {error.message && (
              <span className="mt-1 block font-mono text-xs opacity-70">
                {error.message}
              </span>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* 다시 시도 버튼 */}
          <Button onClick={reset} className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>

          {/* 홈으로 버튼 */}
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
