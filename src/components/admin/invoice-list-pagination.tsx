'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InvoiceListPaginationProps {
  nextCursor: string | null
  hasMore: boolean
}

// 견적서 목록 페이지네이션 컴포넌트
// 커서 기반 페이지네이션으로 이전/다음 페이지 이동
export function InvoiceListPagination({
  nextCursor,
  hasMore,
}: InvoiceListPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCursor = searchParams.get('cursor')
  const currentStatus = searchParams.get('status')

  // 공통 파라미터 생성 헬퍼
  const buildParams = (cursor?: string) => {
    const params = new URLSearchParams()
    if (currentStatus) params.set('status', currentStatus)
    if (cursor) params.set('cursor', cursor)
    return params.toString()
  }

  // 이전 페이지 (첫 페이지로 이동 - cursor 제거)
  const handlePrev = () => {
    const query = buildParams()
    router.push(`/admin/invoices${query ? `?${query}` : ''}`)
  }

  // 다음 페이지 (nextCursor로 이동)
  const handleNext = () => {
    if (!nextCursor) return
    const query = buildParams(nextCursor)
    router.push(`/admin/invoices?${query}`)
  }

  // 현재 페이지가 첫 페이지인지 확인
  const isFirstPage = !currentCursor

  // 첫 페이지이고 다음 페이지도 없으면 페이지네이션 숨김
  if (isFirstPage && !hasMore) return null

  return (
    <div className="flex items-center justify-between py-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={isFirstPage}
      >
        <ChevronLeft className="mr-1 size-4" />
        이전
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!hasMore}
      >
        다음
        <ChevronRight className="ml-1 size-4" />
      </Button>
    </div>
  )
}
