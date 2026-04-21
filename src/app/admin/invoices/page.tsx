import { Suspense } from 'react'
import { getInvoiceList } from '@/lib/notion-invoice-list'
import { InvoiceListTable } from '@/components/admin/invoice-list-table'
import { InvoiceListCard } from '@/components/admin/invoice-list-card'
import { InvoiceListEmpty } from '@/components/admin/invoice-list-empty'
import { InvoiceListFilter } from '@/components/admin/invoice-list-filter'
import { InvoiceListPagination } from '@/components/admin/invoice-list-pagination'

interface AdminInvoicesPageProps {
  searchParams: Promise<{ status?: string; cursor?: string }>
}

// 관리자 견적서 목록 페이지 (Server Component)
// Next.js 15 규칙: searchParams는 Promise 타입, 반드시 await 처리
export default async function AdminInvoicesPage({
  searchParams,
}: AdminInvoicesPageProps) {
  const { status, cursor } = await searchParams

  // Notion API에서 견적서 목록 조회 (캐싱 적용)
  const { items, nextCursor, hasMore } = await getInvoiceList({
    status,
    cursor,
  })

  return (
    <div className="space-y-4">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">견적서 목록</h1>
        <p className="text-muted-foreground text-sm">
          총 {items.length}건{hasMore ? ' (더 있음)' : ''}
        </p>
      </div>

      {/* 상태 필터 탭 - Client Component, Suspense로 감싸기 */}
      <Suspense fallback={<div className="h-10" />}>
        <InvoiceListFilter />
      </Suspense>

      {/* 목록 렌더링 */}
      {items.length === 0 ? (
        <InvoiceListEmpty />
      ) : (
        <>
          {/* 데스크톱: 테이블 뷰 (md 이상) */}
          <div className="hidden md:block">
            <InvoiceListTable items={items} />
          </div>

          {/* 모바일: 카드 뷰 (md 미만) */}
          <div className="md:hidden">
            <InvoiceListCard items={items} />
          </div>
        </>
      )}

      {/* 페이지네이션 - Client Component, Suspense로 감싸기 */}
      <Suspense fallback={<div className="h-10" />}>
        <InvoiceListPagination nextCursor={nextCursor} hasMore={hasMore} />
      </Suspense>
    </div>
  )
}
