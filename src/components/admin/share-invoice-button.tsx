'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Mail, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ShareInvoiceButtonProps {
  invoiceId: string
  invoiceNumber?: string
}

export function ShareInvoiceButton({
  invoiceId,
  invoiceNumber,
}: ShareInvoiceButtonProps) {
  const [copied, setCopied] = useState(false)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : '')
  const url = `${siteUrl}/invoice/${invoiceId}`

  const subject = invoiceNumber ? `견적서 ${invoiceNumber}` : '견적서 공유'
  const body = `견적서를 확인해 주세요.\n\n${url}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    toast('링크가 복사되었습니다')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl, '_blank')
  }

  const handleTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(subject)}`
    window.open(telegramUrl, '_blank')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="견적서 공유"
          className="size-8"
        >
          <Share2 className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopy} className="gap-2">
          {copied ? (
            <Check className="size-4 text-green-600" />
          ) : (
            <Copy className="size-4" />
          )}
          링크 복사
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEmail} className="gap-2">
          <Mail className="size-4" />
          이메일로 공유
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTelegram} className="gap-2">
          <Send className="size-4" />
          텔레그램으로 공유
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
