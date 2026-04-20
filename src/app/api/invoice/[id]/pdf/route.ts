import { renderToBuffer } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import { getInvoiceById } from '@/lib/notion-invoice'
import { InvoicePdfDocument } from '@/components/invoice-pdf'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const invoice = await getInvoiceById(id)

  if (!invoice) {
    return new Response('견적서를 찾을 수 없습니다.', { status: 404 })
  }

  const element = createElement(InvoicePdfDocument, {
    invoice,
  }) as ReactElement<DocumentProps>

  const buffer = await renderToBuffer(element)
  const uint8 = new Uint8Array(buffer)
  const filename = `${invoice.invoiceNumber}.pdf`

  return new Response(uint8, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
    },
  })
}
