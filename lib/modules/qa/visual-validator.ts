import puppeteer from 'puppeteer'

export interface VisualQAResult {
  score: number // 0-100
  passed: boolean
  checks: {
    loadsSuccessfully: boolean
    noVisibleErrors: boolean
    responsiveDesign: boolean
    imagesLoad: boolean
    ctaVisible: boolean
  }
  screenshotPath: string | null
}

export async function performVisualQA(
  siteUrl: string,
  siteId: string
): Promise<VisualQAResult> {

  console.log(`🎨 Performing visual QA for: ${siteUrl}`)

  let browser

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    const checks = {
      loadsSuccessfully: false,
      noVisibleErrors: false,
      responsiveDesign: false,
      imagesLoad: false,
      ctaVisible: false,
    }

    // Check 1: Page loads successfully
    try {
      await page.goto(siteUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      })
      checks.loadsSuccessfully = true
    } catch (error) {
      console.error('Page load failed:', error)
      return {
        score: 0,
        passed: false,
        checks,
        screenshotPath: null,
      }
    }

    // Check 2: No visible error messages
    const errorElements = await page.$$('[class*="error"], [class*="Error"], .error-message')
    checks.noVisibleErrors = errorElements.length === 0

    // Check 3: Responsive design (test mobile viewport)
    await page.setViewport({ width: 375, height: 667 })
    await new Promise(resolve => setTimeout(resolve, 1000))

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })

    checks.responsiveDesign = !hasHorizontalScroll

    // Back to desktop
    await page.setViewport({ width: 1920, height: 1080 })

    // Check 4: Images load (check for broken images)
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.filter(img => !img.complete || img.naturalHeight === 0).length
    })

    checks.imagesLoad = brokenImages === 0

    // Check 5: CTA button visible
    const ctaButton = await page.$('button, a[href*="stripe"], a[href*="checkout"]')
    checks.ctaVisible = !!ctaButton

    // Take screenshot
    const screenshotPath = `screenshots/${siteId}-${Date.now()}.png`
    await page.screenshot({
      path: `public/${screenshotPath}`,
      fullPage: true
    })

    // Calculate score
    const passedChecks = Object.values(checks).filter(Boolean).length
    const score = Math.round((passedChecks / Object.keys(checks).length) * 100)
    const passed = score >= 80 // Must pass 4/5 checks

    console.log(`✅ Visual QA complete: ${score}/100 (${passed ? 'PASS' : 'FAIL'})`)

    return {
      score,
      passed,
      checks,
      screenshotPath: `/${screenshotPath}`,
    }

  } catch (error) {
    console.error('❌ Visual QA failed:', error)

    return {
      score: 0,
      passed: false,
      checks: {
        loadsSuccessfully: false,
        noVisibleErrors: false,
        responsiveDesign: false,
        imagesLoad: false,
        ctaVisible: false,
      },
      screenshotPath: null,
    }

  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
