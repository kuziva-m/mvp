interface QAResult {
  passed: boolean;
  score: number;
  report: string[];
}

export async function performQAChecks(
  websiteId: string,
  content: any
): Promise<QAResult> {
  const issues: string[] = [];
  let score = 100;

  // 1. Basic Validation
  if (!content.heroHeadline) {
    issues.push("Critical: Hero Headline is missing.");
    score -= 30;
  }

  if (!content.contactEmail || !content.contactEmail.includes("@")) {
    issues.push("Critical: Invalid contact email.");
    score -= 30;
  }

  // 2. Strict Placeholder Check
  const placeholderPatterns = [/lorem ipsum/i, /insert text/i];
  const contentString = JSON.stringify(content);

  if (placeholderPatterns.some((p) => p.test(contentString))) {
    issues.push("Flagged: Placeholder text detected.");
    score -= 50;
  }

  const passed = score >= 80;

  return {
    passed,
    score,
    report: issues.length > 0 ? issues : ["QA Passed: No issues found."],
  };
}
