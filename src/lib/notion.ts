import { Client } from '@notionhq/client'

// 모듈 스코프에서 클라이언트 인스턴스 캐싱
let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (notionClient) return notionClient

  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) {
    throw new Error(
      'NOTION_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일에 NOTION_API_KEY를 추가하세요.'
    )
  }

  notionClient = new Client({ auth: apiKey })
  return notionClient
}
