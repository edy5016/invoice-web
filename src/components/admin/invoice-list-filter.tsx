'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// 탭 필터 옵션 정의
const FILTER_TABS = [
  { label: '전체', value: '' },
  { label: '대기', value: '대기' },
  { label: '확정', value: '확정' },
  { label: '취소', value: '취소' },
] as const

// 견적서 상태 필터 탭 컴포넌트
// 탭 클릭 시 URL 쿼리 파라미터를 업데이트하여 필터링
export function InvoiceListFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 현재 활성 탭 (status 파라미터 없으면 전체)
  const currentStatus = searchParams.get('status') ?? ''

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams()

    // 상태 필터 설정 (전체는 파라미터 제거)
    if (value) {
      params.set('status', value)
    }
    // 탭 변경 시 cursor는 초기화 (첫 페이지로 이동)

    router.push(
      `/admin/invoices${params.toString() ? `?${params.toString()}` : ''}`
    )
  }

  return (
    <Tabs value={currentStatus} onValueChange={handleTabChange}>
      <TabsList>
        {FILTER_TABS.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
