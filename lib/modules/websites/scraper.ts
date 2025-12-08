import puppeteer from 'puppeteer'
import type { ScrapedData } from '@/types'

export async function scrapeWebsite(url: string): Promise<ScrapedData | null> {
  let browser = null

  try {
    console.log(`Starting scrape for: ${url}`)

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // Set timeout and viewport
    await page.setViewport({ width: 1920, height: 1080 })

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Extract data from the page
    const scrapedData = await page.evaluate(() => {
      // Extract logo
      const findLogo = (): string | null => {
        const logoSelectors = [
          'img[alt*="logo" i]',
          'img[class*="logo" i]',
          'img[id*="logo" i]',
          '.logo img',
          '#logo img',
          'header img:first-of-type',
          'nav img:first-of-type',
        ]

        for (const selector of logoSelectors) {
          const img = document.querySelector(selector) as HTMLImageElement
          if (img?.src) return img.src
        }
        return null
      }

      // Extract colors from computed styles
      const extractColors = () => {
        const primary = window.getComputedStyle(
          document.querySelector('header') ||
            document.querySelector('nav') ||
            document.body
        ).backgroundColor

        const buttons = document.querySelectorAll('button, .button, .btn')
        const secondary =
          buttons.length > 0
            ? window.getComputedStyle(buttons[0] as Element).backgroundColor
            : null

        const text = window.getComputedStyle(
          document.querySelector('p') ||
            document.querySelector('body') ||
            document.body
        ).color

        return {
          primary: primary !== 'rgba(0, 0, 0, 0)' ? primary : null,
          secondary: secondary !== 'rgba(0, 0, 0, 0)' ? secondary : null,
          text: text || null,
        }
      }

      // Extract headings
      const extractHeadings = (): string[] => {
        const headings: string[] = []
        const h1s = document.querySelectorAll('h1')
        const h2s = document.querySelectorAll('h2')

        h1s.forEach((h) => {
          const text = h.textContent?.trim()
          if (text) headings.push(text)
        })
        h2s.forEach((h) => {
          const text = h.textContent?.trim()
          if (text) headings.push(text)
        })

        return headings.slice(0, 10) // Limit to 10 headings
      }

      // Extract meta description
      const metaDescription =
        (
          document.querySelector(
            'meta[name="description"]'
          ) as HTMLMetaElement
        )?.content || null

      // Extract page title
      const pageTitle = document.title || null

      return {
        logoUrl: findLogo(),
        colors: extractColors(),
        headings: extractHeadings(),
        metaDescription,
        pageTitle,
      }
    })

    // Take screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
      encoding: 'base64',
    })

    await browser.close()

    const result: ScrapedData = {
      ...scrapedData,
      screenshot: screenshot as string,
      scrapedAt: new Date().toISOString(),
    }

    console.log('Scraping completed successfully')
    return result
  } catch (error) {
    console.error('Scraping error:', error)

    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    return null
  }
}
