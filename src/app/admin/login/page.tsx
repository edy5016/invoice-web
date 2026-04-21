'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// 로그인 폼 유효성 검사 스키마
const loginSchema = z.object({
  key: z.string().min(1, '인증 키를 입력해주세요.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// 관리자 로그인 페이지 (독립 레이아웃)
export default function AdminLoginPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { key: '' },
  })

  // 로그인 폼 제출 핸들러
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: values.key }),
      })

      if (response.ok) {
        // 전체 페이지 이동으로 어드민 레이아웃(사이드바)을 새로 렌더링
        window.location.href = '/admin/invoices'
      } else {
        const data = (await response.json()) as { error?: string }
        setServerError(data.error ?? '인증에 실패했습니다.')
      }
    } catch {
      setServerError('서버와 통신 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 로고 및 타이틀 */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl">
            <FileText className="size-6" />
          </div>
          <div className="text-center">
            <h1 className="text-foreground text-2xl font-bold">
              관리자 로그인
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              견적서 관리 시스템에 접근하려면 인증이 필요합니다.
            </p>
          </div>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인증 키</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="관리자 인증 키를 입력하세요"
                          className="pl-9"
                          autoComplete="current-password"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 서버 에러 메시지 */}
              {serverError && (
                <p
                  role="alert"
                  className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
                >
                  {serverError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '인증 중...' : '로그인'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
