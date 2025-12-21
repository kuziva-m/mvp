export class QAService {
  static async checkSite(url: string): Promise<{
    passed: boolean;
    score: number;
    issues: string[];
  }> {
    if (!url) return { passed: false, score: 0, issues: ["No URL provided"] };

    try {
      const response = await fetch(url, { method: "HEAD" }); // Lightweight check

      if (response.status === 200) {
        return {
          passed: true,
          score: 100,
          issues: [],
        };
      } else {
        return {
          passed: false,
          score: 0,
          issues: [`Site returned status code: ${response.status}`],
        };
      }
    } catch (error) {
      return {
        passed: false,
        score: 0,
        issues: ["Site is unreachable", (error as Error).message],
      };
    }
  }
}
