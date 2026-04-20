import { APIResponseError } from '@notionhq/client'
import type { GetPageResponse } from '@notionhq/client/build/src/api-endpoints'
import { getNotionClient } from './notion'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'

// ============================================================
// 커스텀 에러 클래스 (TASK 022)
// ============================================================

export class NotionAuthError extends Error {
  constructor() {
    super('Notion API 인증에 실패했습니다. API 키를 확인하세요.')
    this.name = 'NotionAuthError'
  }
}

export class NotionRateLimitError extends Error {
  constructor() {
    super('Notion API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.')
    this.name = 'NotionRateLimitError'
  }
}

export class NotionServerError extends Error {
  constructor(status: number) {
    super(`Notion 서버 오류가 발생했습니다. (상태 코드: ${status})`)
    this.name = 'NotionServerError'
  }
}

// ============================================================
// 타입 가드 및 헬퍼
// ============================================================

type FullPage = Extract<GetPageResponse, { properties: unknown }>

function isFullPage(page: GetPageResponse): page is FullPage {
  return 'properties' in page
}

function extractText(
  richText: Array<{ plain_text: string }> | undefined
): string {
  return richText?.map(t => t.plain_text).join('') ?? ''
}

// Notion 상태명 → InvoiceStatus 매핑
function mapNotionStatus(name: string | undefined): InvoiceStatus {
  const map: Record<string, InvoiceStatus> = {
    대기: 'draft',
    확정: 'active',
    취소: 'cancelled',
    만료: 'expired',
  }
  return map[name ?? ''] ?? 'draft'
}

// ============================================================
// Items 조회
// ============================================================

async function getInvoiceItems(itemIds: string[]): Promise<InvoiceItem[]> {
  if (itemIds.length === 0) return []

  const notion = getNotionClient()
  return Promise.all(
    itemIds.map(async id => {
      const page = await notion.pages.retrieve({ page_id: id })
      if (!isFullPage(page))
        return { id, name: '', quantity: 1, unitPrice: 0, amount: 0 }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props = page.properties as Record<string, any>
      const name = extractText(props['항목명']?.title)
      const quantity: number = props['수량']?.number ?? 1
      const unitPrice: number = props['단가']?.number ?? 0
      const amount: number =
        props['금액']?.formula?.number ?? quantity * unitPrice

      return { id, name, quantity, unitPrice, amount } satisfies InvoiceItem
    })
  )
}

// ============================================================
// Notion 페이지 → Invoice 변환
// ============================================================

async function parseNotionInvoice(page: FullPage): Promise<Invoice> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = page.properties as Record<string, any>

  const invoiceNumber = extractText(props['견적서 번호']?.title) || page.id
  const status = mapNotionStatus(props['상태']?.status?.name)
  const issueDate: string = props['발행일']?.date?.start ?? ''
  const dueDate: string = props['유효기간']?.date?.start ?? ''
  const clientName = extractText(props['클라이언트 명']?.rich_text)
  const totalAmount: number = props['총 금액']?.number ?? 0

  const itemIds: string[] = (props['items']?.relation ?? []).map(
    (r: { id: string }) => r.id
  )
  const items = await getInvoiceItems(itemIds)

  const subtotal =
    items.length > 0
      ? items.reduce((sum, item) => sum + item.amount, 0)
      : Math.round(totalAmount / 1.1)
  const taxRate = 0.1
  const taxAmount = Math.round(subtotal * taxRate)

  return {
    id: page.id,
    invoiceNumber,
    title: invoiceNumber,
    status,
    issueDate,
    dueDate,
    supplier: { companyName: '', contactName: '' },
    client: { companyName: clientName, contactName: '' },
    items,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount: items.length > 0 ? subtotal + taxAmount : totalAmount,
  }
}

// ============================================================
// 공개 API
// ============================================================

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const notion = getNotionClient()
    const page = await notion.pages.retrieve({ page_id: id })

    if (!isFullPage(page)) return null

    return await parseNotionInvoice(page)
  } catch (error) {
    if (error instanceof APIResponseError) {
      if (error.status === 404) return null
      if (error.status === 401) throw new NotionAuthError()
      if (error.status === 429) throw new NotionRateLimitError()
      if (error.status >= 500) throw new NotionServerError(error.status)
    }
    throw error
  }
}
