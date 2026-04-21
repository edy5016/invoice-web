'use server'

import { revalidateTag } from 'next/cache'

// 견적서 목록 캐시 무효화 Server Action
// 노션 데이터 변경 후 목록을 즉시 갱신할 때 사용
export async function revalidateInvoiceList() {
  revalidateTag('invoice-list')
}
