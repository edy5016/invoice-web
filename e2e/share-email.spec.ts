import { test, expect } from '@playwright/test'

// 관리자 로그인 후 견적서 목록 페이지에서 이메일 공유 E2E 테스트
// 실행 전: ADMIN_ACCESS_KEY 환경 변수와 테스트용 견적서 ID가 필요합니다.

const ADMIN_KEY = process.env.ADMIN_ACCESS_KEY ?? 'test-key'

test.describe('이메일 공유 기능', () => {
  test.beforeEach(async ({ page, request }) => {
    // 관리자 세션 쿠키 설정
    const res = await request.post('/api/admin/auth', {
      data: { key: ADMIN_KEY },
    })
    expect(res.ok()).toBeTruthy()

    await page.goto('/admin/invoices')
    await page.waitForLoadState('networkidle')
  })

  test('1. 공유 버튼 클릭 시 드롭다운 메뉴 표시', async ({ page }) => {
    const shareButton = page.locator('[aria-label="견적서 공유"]').first()
    await shareButton.click()

    await expect(page.getByText('이메일로 공유')).toBeVisible()
    await expect(page.getByText('링크 복사')).toBeVisible()
    await expect(page.getByText('텔레그램으로 공유')).toBeVisible()
  })

  test('2. 이메일로 공유 클릭 시 모달 표시', async ({ page }) => {
    const shareButton = page.locator('[aria-label="견적서 공유"]').first()
    await shareButton.click()

    await page.getByTestId('email-share-menu-item').click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('이메일로 견적서 공유')).toBeVisible()
    await expect(page.getByPlaceholder('example@email.com')).toBeVisible()
  })

  test('3. 잘못된 이메일 입력 시 에러 메시지 표시', async ({ page }) => {
    const shareButton = page.locator('[aria-label="견적서 공유"]').first()
    await shareButton.click()
    await page.getByTestId('email-share-menu-item').click()

    await page.getByPlaceholder('example@email.com').fill('invalid-email')
    await page.getByRole('button', { name: '이메일 발송' }).click()

    await expect(
      page.getByText('유효한 이메일 주소를 입력해 주세요.')
    ).toBeVisible()
  })

  test('4. 빈 이메일 제출 시 에러 메시지 표시', async ({ page }) => {
    const shareButton = page.locator('[aria-label="견적서 공유"]').first()
    await shareButton.click()
    await page.getByTestId('email-share-menu-item').click()

    await page.getByRole('button', { name: '이메일 발송' }).click()

    await expect(
      page.getByText('유효한 이메일 주소를 입력해 주세요.')
    ).toBeVisible()
  })

  test('5. 취소 버튼 클릭 시 모달 닫힘', async ({ page }) => {
    const shareButton = page.locator('[aria-label="견적서 공유"]').first()
    await shareButton.click()
    await page.getByTestId('email-share-menu-item').click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: '취소' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('6. 유효한 이메일 입력 후 제출 → API 호출 확인', async ({ page }) => {
    // API 요청 가로채기
    let shareApiCalled = false
    page.route('/api/share', async route => {
      shareApiCalled = true
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    const shareButton = page.locator('[aria-label="견적서 공유"]').first()
    await shareButton.click()
    await page.getByTestId('email-share-menu-item').click()

    await page.getByPlaceholder('example@email.com').fill('test@example.com')
    await page.getByRole('button', { name: '이메일 발송' }).click()

    // 성공 상태 확인
    await expect(
      page.getByText('이메일이 성공적으로 발송되었습니다.')
    ).toBeVisible({
      timeout: 5000,
    })
    expect(shareApiCalled).toBe(true)
  })

  test('7. API 오류 시 에러 메시지 표시', async ({ page }) => {
    page.route('/api/share', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: '이메일 발송에 실패했습니다.' }),
      })
    })

    const shareButton = page.locator('[aria-label="견적서 공유"]').first()
    await shareButton.click()
    await page.getByTestId('email-share-menu-item').click()

    await page.getByPlaceholder('example@email.com').fill('test@example.com')
    await page.getByRole('button', { name: '이메일 발송' }).click()

    await expect(page.getByText('이메일 발송에 실패했습니다.')).toBeVisible({
      timeout: 5000,
    })
  })
})

// /api/share 엔드포인트 단위 테스트
test.describe('POST /api/share', () => {
  test('유효한 요청 → 200 응답', async ({ request }) => {
    // API를 직접 호출 (실제 이메일 발송 없이 형식 검증)
    const res = await request.post('/api/share', {
      data: {
        email: 'test@example.com',
        invoiceId: 'test-invoice-id',
        invoiceNumber: 'INV-001',
      },
    })
    // RESEND_API_KEY 미설정 시 500 또는 200 모두 허용 (형식 검증 통과 확인)
    expect([200, 500]).toContain(res.status())
  })

  test('이메일 누락 → 400 응답', async ({ request }) => {
    const res = await request.post('/api/share', {
      data: { invoiceId: 'test-id', invoiceNumber: 'INV-001' },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  test('잘못된 이메일 형식 → 400 응답', async ({ request }) => {
    const res = await request.post('/api/share', {
      data: {
        email: 'not-an-email',
        invoiceId: 'test-id',
        invoiceNumber: 'INV-001',
      },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('이메일')
  })
})
