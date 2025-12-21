import { createClient } from "@/lib/supabase/server";

/**
 * Checks for leads that need follow-up emails based on the schedule:
 * Day 3, Day 7, Day 11, Day 14 after initial contact.
 */
export async function processFollowUps() {
  const supabase = await createClient();
  const now = new Date();

  // Fetch all active leads who haven't subscribed yet
  // We type cast the select to ensure TS understands the joined structure
  const { data: leads, error } = await supabase
    .from("leads")
    .select(
      "id, business_name, email, email_sent_at, status, lead_magnet_submissions(status)"
    )
    .not("email_sent_at", "is", null) // Must have had initial contact
    .neq("status", "subscribed") // Ignore if already converted
    .neq("status", "churned"); // Ignore if dead

  if (error) {
    console.error("Error fetching leads for follow-up:", error);
    return;
  }

  // Helper to calculate days difference using native Date
  const getDaysDiff = (date1: Date, date2: Date) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date1.getTime() - date2.getTime();
    return Math.floor(diffInTime / oneDay);
  };

  const updates = [];

  for (const lead of leads) {
    if (!lead.email_sent_at) continue;

    const sentDate = new Date(lead.email_sent_at);
    const diffDays = getDaysDiff(now, sentDate);

    let templateToUse = null;

    // Day 3
    if (diffDays === 3) {
      // Fix: Handle the array returned by Supabase join
      // We explicitly treat it as an array and check the first item
      const submissions = lead.lead_magnet_submissions as unknown as {
        status: string;
      }[];
      const hasVisited =
        Array.isArray(submissions) &&
        submissions.length > 0 &&
        submissions[0].status === "visited";

      templateToUse = hasVisited
        ? "follow-up-day-3-visited"
        : "follow-up-day-3-not-visited";
    }
    // Day 7
    else if (diffDays === 7) {
      templateToUse = "follow-up-day-7-value";
    }
    // Day 11 (Urgency: "Removed in 3 days")
    else if (diffDays === 11) {
      templateToUse = "follow-up-day-11-warning";
    }
    // Day 14 (Final: "24 hours left")
    else if (diffDays === 14) {
      templateToUse = "follow-up-day-14-final";
    }

    if (templateToUse) {
      console.log(
        `[FollowUp] Sending ${templateToUse} to ${lead.business_name} (Day ${diffDays})`
      );
      updates.push({ lead: lead.business_name, template: templateToUse });

      // Perform Mock Send
      // In real implementation: await sendEmail(lead.email, templateToUse, { ...context });
    }
  }

  return { processed: leads.length, emailsTriggered: updates.length };
}
