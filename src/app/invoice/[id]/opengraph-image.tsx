import { ImageResponse } from 'next/og'
import { getInvoiceById } from '@/lib/notion-invoice'

// Node.js 런타임 사용 (노션 API 호출을 위해)
export const runtime = 'nodejs'
// OG 이미지 대체 텍스트
export const alt = '견적서'
// OG 이미지 크기 (표준 1200x630)
export const size = { width: 1200, height: 630 }
// 이미지 콘텐츠 타입
export const contentType = 'image/png'

// 견적서 OG 이미지 생성 (Next.js 파일 기반 자동 매핑)
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // 견적서 정보 초기화 (에러 시 기본값 표시)
  let invoiceNumber = '견적서'
  let clientName = ''
  let totalAmount = ''

  try {
    const invoice = await getInvoiceById(id)
    if (invoice) {
      invoiceNumber = invoice.invoiceNumber
      clientName = invoice.client.companyName || ''
      // 금액을 한국 원화 형식으로 포맷
      totalAmount = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(invoice.totalAmount)
    }
  } catch {
    // 에러 시 기본값 사용
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 레이블 */}
        <div style={{ fontSize: 24, color: '#6b7280', marginBottom: 16 }}>
          견적서
        </div>

        {/* 견적서 번호 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: 24,
          }}
        >
          {invoiceNumber}
        </div>

        {/* 클라이언트 회사명 (있는 경우만 표시) */}
        {clientName && (
          <div style={{ fontSize: 32, color: '#374151', marginBottom: 16 }}>
            {clientName}
          </div>
        )}

        {/* 총 금액 (있는 경우만 표시) */}
        {totalAmount && (
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#2563eb' }}>
            {totalAmount}
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
