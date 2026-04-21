'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface CopyInvoiceLinkButtonProps {
  invoiceId: string
}

// 견적서 공유 링크를 클립보드에 복사하는 클라이언트 컴포넌트
export function CopyInvoiceLinkButton({
  invoiceId,
}: CopyInvoiceLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  // NEXT_PUBLIC_* 변수는 클라이언트에서 직접 접근 가능
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : '')

  const url = `${siteUrl}/invoice/${invoiceId}`

  const handleCopy = async () => {
    try {
      // 최신 Clipboard API 시도
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast('링크가 복사되었습니다')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API 실패 시 execCommand 폴백
      try {
        const input = document.createElement('input')
        input.value = url
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        setCopied(true)
        toast('링크가 복사되었습니다')
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // 최종 실패 시 URL을 description으로 표시
        toast.error('복사에 실패했습니다', { description: url })
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label="견적서 링크 복사"
      className="size-8"
    >
      {copied ? (
        <Check className="size-4 text-green-600" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  )
}
