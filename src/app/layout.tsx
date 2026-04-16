import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '견적서 조회',
  description:
    '노션 기반 견적서 관리 시스템 - 견적서를 웹에서 조회하고 PDF로 다운로드하세요.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  )
}
