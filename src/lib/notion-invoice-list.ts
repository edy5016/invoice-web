import { unstable_cache } from 'next/cache'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { getNotionClient } from '@/lib/notion'
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

function isFullPage(page: unknown): page is PageObjectResponse {
  return (
    typeof page === 'object' &&
    page !== null &&
    'properties' in page &&
    'parent' in page
  )
}

// notion.search를 사용하여 데이터베이스 페이지 목록 조회
// @notionhq/client v5에서 databases.query가 dataSources.query로 대체되었으나
// 기존 Notion DB는 search API를 통해 접근 가능
async function getInvoiceListUncached(
  filter: InvoiceListFilter
): Promise<InvoiceListResponse> {
  const databaseId = env.NOTION_DATABASE_ID

  if (!databaseId) {
    return { items: [], nextCursor: null, hasMore: false }
  }

  const notion = getNotionClient()

  const response = await notion.search({
    filter: { property: 'object', value: 'page' },
    sort: { timestamp: 'last_edited_time', direction: 'descending' },
    page_size: filter.pageSize ?? 20,
    ...(filter.cursor && { start_cursor: filter.cursor }),
  })

  // 해당 데이터베이스 소속 페이지만 필터링
  const normalizedDbId = databaseId.replace(/-/g, '')
  const dbPages = response.results.filter(page => {
    if (!isFullPage(page)) return false
    const parent = page.parent
    if (parent.type !== 'database_id') return false
    return parent.database_id.replace(/-/g, '') === normalizedDbId
  }) as PageObjectResponse[]

  // 상태 필터 적용 (클라이언트 사이드)
  const filteredPages = filter.status
    ? dbPages.filter(page => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const props = page.properties as Record<string, any>
        return props['상태']?.status?.name === filter.status
      })
    : dbPages

  const items: InvoiceListItem[] = filteredPages.map(page => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = page.properties as Record<string, any>

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
    nextCursor: response.next_cursor,
    hasMore: response.has_more,
  }
}

// filter를 인자로 전달하여 Next.js가 자동으로 캐시 키를 생성하도록 함
const getInvoiceListCached = unstable_cache(
  getInvoiceListUncached,
  ['invoice-list'],
  { revalidate: 60, tags: ['invoice-list'] }
)

export const getInvoiceList = (filter: InvoiceListFilter = {}) =>
  getInvoiceListCached(filter)
