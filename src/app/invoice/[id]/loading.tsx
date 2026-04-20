import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// 견적서 페이지 로딩 스켈레톤 UI (서버 컴포넌트)
export default function InvoiceLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* 네비게이션 바 스켈레톤 */}
      <div className="bg-background sticky top-0 z-10 border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* 헤더 카드 스켈레톤 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-32" />
                {/* 배지 스켈레톤 */}
                <Skeleton className="h-6 w-12" />
              </div>
              {/* 제목 스켈레톤 */}
              <Skeleton className="mt-2 h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-36" />
              </div>
            </CardContent>
          </Card>

          {/* 공급자/클라이언트 정보 스켈레톤 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[0, 1].map(i => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-16" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 견적 항목 테이블 스켈레톤 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* 테이블 헤더 */}
                <div className="flex justify-between border-b pb-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {/* 5개 행 스켈레톤 */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 금액 요약 스켈레톤 */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between border-t pt-3">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-7 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
