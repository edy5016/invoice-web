import { z } from 'zod'

// 환경 변수 스키마 정의
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // Notion API 설정 (배포 시 반드시 설정 필요)
  NOTION_API_KEY: z.string().optional(),
  NOTION_DATABASE_ID: z.string().optional(),
})

// 환경 변수 파싱 및 유효성 검사
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
})

export type Env = z.infer<typeof envSchema>
