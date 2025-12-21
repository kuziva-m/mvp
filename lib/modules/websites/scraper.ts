import puppeteer from "puppeteer";

// Define the shape of scraped data
export interface ScrapedData {
  businessName?: string;
  logoUrl?: string;
  copyAnalysis?: string;
  email?: string;
  phone?: string;
  description?: string;
}

export async function scrapeWebsite(url: string): Promise<ScrapedData | null> {
  let browser = null;

  try {
    console.log(`Starting scrape for: ${url}`);

    // Launch puppeteer (ensure you have it installed or use a lightweight fetch alternative if preferred)
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const data = await page.evaluate(() => {
      // 1. Logo Extraction Strategy
      // Check OG Image, Favicon, or img tags with 'logo' in class/id
      const ogImage = document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content");

      let logoUrl = ogImage;
      if (!logoUrl) {
        const logoImg = document.querySelector(
          'img[src*="logo"], img[class*="logo"], img[id*="logo"]'
        ) as HTMLImageElement;
        if (logoImg) logoUrl = logoImg.src;
      }

      // 2. Copy Analysis Strategy
      // Grab main headings and meta description
      const title = document.title;
      const description =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "";
      const h1s = Array.from(document.querySelectorAll("h1"))
        .map((h) => h.innerText)
        .join(" ");
      const h2s = Array.from(document.querySelectorAll("h2"))
        .map((h) => h.innerText)
        .join(" ");
      const bodyText = document.body.innerText.substring(0, 1000); // Sample first 1000 chars

      // Simple concatenation for the AI to analyze later
      const copyAnalysis = `Title: ${title}\nDescription: ${description}\nHeadlines: ${h1s} ${h2s}\nSample Text: ${bodyText.replace(
        /\n/g,
        " "
      )}`;

      // 3. Contact Info (Simple Regex)
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
      const phoneRegex =
        /((\+?\d{1,3})?[-. ]?)?\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})/g;

      const emailMatch = document.body.innerHTML.match(emailRegex);
      const phoneMatch = document.body.innerText.match(phoneRegex);

      return {
        businessName: title,
        logoUrl: logoUrl || undefined,
        copyAnalysis: copyAnalysis,
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        description,
      };
    });

    return data;
  } catch (error) {
    console.error("Scraping failed:", error);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}
