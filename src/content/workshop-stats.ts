import editions from "@/content/workshop-editions.json";

/**
 * 2026: organisers' stats.txt, reconciled against the 78-row decision CSV
 * (53 Accept, 19 Reject, 6 Desk reject), plus one pre-review desk rejection.
 * The 6 spotlights and 1 award are nested subsets of the 53 accepted papers.
 * 2025 submissions: organiser-confirmed 29 September 2026; OpenReview tally unverified.
 * 2025 accepted papers: published first-edition accepted-poster total.
 */
export const workshopStats = editions;

export function yoyGrowth(current: number, previous: number): string {
  const growth = ((current - previous) / previous) * 100;
  return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
}
