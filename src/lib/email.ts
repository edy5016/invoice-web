import { Resend } from 'resend'
import { env } from '@/lib/env'

const resend = new Resend(env.RESEND_API_KEY ?? 're_test')

const FROM_EMAIL = env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

export function buildInvoiceEmailHtml(params: {
  invoiceNumber: string
  invoiceUrl: string
  recipientEmail: string
}): string {
  const { invoiceNumber, invoiceUrl } = params
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>견적서 공유</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 40px 16px; }
    .wrapper { max-width: 560px; margin: 0 auto; }
    .card { background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .logo { font-size: 20px; font-weight: 700; color: #18181b; margin-bottom: 32px; }
    h1 { font-size: 22px; font-weight: 600; color: #18181b; margin: 0 0 12px; }
    p { font-size: 15px; color: #52525b; line-height: 1.6; margin: 0 0 24px; }
    .btn { display: inline-block; background: #18181b; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 600; padding: 13px 28px; border-radius: 8px; }
    .divider { border: none; border-top: 1px solid #e4e4e7; margin: 32px 0; }
    .url-box { background: #f4f4f5; border-radius: 8px; padding: 14px 16px; font-size: 13px; color: #71717a; word-break: break-all; }
    .footer { text-align: center; font-size: 13px; color: #a1a1aa; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">invoice</div>
      <h1>견적서 ${invoiceNumber}가 공유되었습니다</h1>
      <p>아래 버튼을 클릭하여 견적서를 확인하세요. PDF 다운로드도 가능합니다.</p>
      <a href="${invoiceUrl}" class="btn">견적서 확인하기</a>
      <hr class="divider" />
      <p style="margin-bottom:8px;font-size:13px;color:#71717a;">링크가 작동하지 않는 경우 아래 URL을 브라우저에 붙여넣으세요.</p>
      <div class="url-box">${invoiceUrl}</div>
    </div>
    <div class="footer">이 이메일은 견적서 공유 요청에 의해 자동으로 발송되었습니다.</div>
  </div>
</body>
</html>`
}

export interface SendInvoiceEmailParams {
  to: string
  invoiceNumber: string
  invoiceUrl: string
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  const { to, invoiceNumber, invoiceUrl } = params

  const html = buildInvoiceEmailHtml({
    invoiceNumber,
    invoiceUrl,
    recipientEmail: to,
  })

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `견적서 ${invoiceNumber} 공유`,
    html,
  })

  if (error) throw new Error(error.message)
  return data
}
