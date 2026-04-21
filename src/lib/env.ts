import { z } from 'zod'

// 환경 변수 스키마 정의
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // Notion API 설정 (배포 시 반드시 설정 필요)
  NOTION_API_KEY: z.string().optional(),
  NOTION_DATABASE_ID: z.string().optional(),
  // 관리자 인증 키
  ADMIN_ACCESS_KEY: z.string().min(1).optional(),
  // 사이트 기본 URL (링크 공유 기능에 사용)
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  // 이메일 발송 (Resend API)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
})

// 환경 변수 파싱 및 유효성 검사
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  ADMIN_ACCESS_KEY: process.env.ADMIN_ACCESS_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
})

export type Env = z.infer<typeof envSchema>
