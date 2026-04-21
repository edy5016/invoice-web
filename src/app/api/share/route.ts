import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendInvoiceEmail } from '@/lib/email'
import { env } from '@/lib/env'

const shareSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해 주세요.'),
  invoiceId: z.string().min(1),
  invoiceNumber: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = shareSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.',
        },
        { status: 400 }
      )
    }

    const { email, invoiceId, invoiceNumber } = parsed.data

    const siteUrl =
      env.NEXT_PUBLIC_SITE_URL ??
      req.headers.get('origin') ??
      'http://localhost:3000'

    const invoiceUrl = `${siteUrl}/invoice/${invoiceId}`

    await sendInvoiceEmail({ to: email, invoiceNumber, invoiceUrl })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '이메일 발송에 실패했습니다.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
