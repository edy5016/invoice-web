import { unstable_cache } from 'next/cache'
import { env } from '@/lib/env'
import type {
  InvoiceListFilter,
  InvoiceListItem,
  InvoiceListResponse,
} from '@/types/invoice'

function extractRichText(
  richText: Array<{ plain_text: string }> | undefined
): string {
  return richText?.map(t => t.plain_text).join('') ?? ''
}

interface NotionProperty {
  title?: Array<{ plain_text: string }>
  rich_text?: Array<{ plain_text: string }>
  date?: { start: string }
  status?: { name: string }
  number?: number
}

interface NotionPage {
  id: string
  properties: Record<string, NotionProperty>
}

interface NotionQueryResponse {
  results: NotionPage[]
  next_cursor: string | null
  has_more: boolean
}

// Notion REST API POST /databases/{id}/query 직접 호출
// @notionhq/client v5에서 databases.query가 제거됐으므로 fetch 사용
async function queryDatabase(
  databaseId: string,
  body: Record<string, unknown>
): Promise<NotionQueryResponse> {
  const apiKey = process.env.NOTION_API_KEY
  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Notion API error ${res.status}: ${err}`)
  }
  return res.json() as Promise<NotionQueryResponse>
}

async function getInvoiceListUncached(
  filter: InvoiceListFilter
): Promise<InvoiceListResponse> {
  const databaseId = env.NOTION_DATABASE_ID

  if (!databaseId) {
    return { items: [], nextCursor: null, hasMore: false }
  }

  const body: Record<string, unknown> = {
    sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
    page_size: filter.pageSize ?? 20,
  }

  if (filter.cursor) {
    body.start_cursor = filter.cursor
  }

  if (filter.status) {
    body.filter = { property: '상태', status: { equals: filter.status } }
  }

  const response = await queryDatabase(databaseId, body)

  const items: InvoiceListItem[] = response.results.map(page => {
    const props = page.properties

    const invoiceNumber =
      extractRichText(props['견적서 번호']?.title) || page.id
    const clientName = extractRichText(props['클라이언트 명']?.rich_text)
    const issueDate: string = props['발행일']?.date?.start ?? ''
    const notionStatus: string = props['상태']?.status?.name ?? ''
    const totalAmount: number = props['총 금액']?.number ?? 0

    return {
      id: page.id,
      invoiceNumber,
      clientName,
      issueDate,
      notionStatus,
      totalAmount,
    } satisfies InvoiceListItem
  })

  return {
    items,
    nextCursor: response.next_cursor ?? null,
    hasMore: response.has_more ?? false,
  }
}

const getInvoiceListCached = unstable_cache(
  getInvoiceListUncached,
  ['invoice-list'],
  { revalidate: 60, tags: ['invoice-list'] }
)

export const getInvoiceList = (filter: InvoiceListFilter = {}) =>
  getInvoiceListCached(filter)

// 대시보드용: 상태별 집계 조회
export async function getInvoiceSummary(): Promise<{
  total: number
  pending: number
  confirmed: number
  cancelled: number
}> {
  const databaseId = env.NOTION_DATABASE_ID
  if (!databaseId) return { total: 0, pending: 0, confirmed: 0, cancelled: 0 }

  const fetchCount = async (status?: string): Promise<number> => {
    let count = 0
    let cursor: string | undefined

    do {
      const body: Record<string, unknown> = {
        page_size: 100,
        ...(cursor && { start_cursor: cursor }),
        ...(status && {
          filter: { property: '상태', status: { equals: status } },
        }),
      }
      const res = await queryDatabase(databaseId, body)
      count += res.results.length
      cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
    } while (cursor)

    return count
  }

  const [total, pending, confirmed, cancelled] = await Promise.all([
    fetchCount(),
    fetchCount('대기'),
    fetchCount('승일'),
    fetchCount('거절'),
  ])

  return { total, pending, confirmed, cancelled }
}
