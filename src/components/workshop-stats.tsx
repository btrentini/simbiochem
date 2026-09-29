import Link from "next/link";
import { ArrowDown, Trophy, Users } from "lucide-react";


import { ReviewScoreDistribution } from "@/components/review-score-distribution";
import { site } from "@/content/site";
import { workshopStats, yoyGrowth } from "@/content/workshop-stats";

const { current, previous } = workshopStats;
const scale = 2.6;
const nodeWidth = 6;
// Thin connectors annotate the reasons for the six post-review desk rejections.
const deskRejectionReasons = [
  { count: 2, label: "Conflict of Interest" },
  { count: 1, label: "Hallucinated references" },
  { count: 3, label: "Failing to do reciprocal review" },
];

const nodes = {
  submissions: { x: 18, y: 132, count: current.submissions, label: "Submissions", colour: "#405578" },
  reviewed: { x: 177, y: 132, count: current.reviewed, label: "Reviewed", colour: "#405578" },
  ranked: { x: 340, y: 132, count: current.ranked, label: "Ranked", colour: "#527d7c" },
  accepted: { x: 505, y: 132, count: current.accepted, label: "Accepted", colour: "#527d7c" },
  spotlights: { x: 705, y: 132, count: current.spotlights, label: "Spotlights / orals", colour: "#527d7c" },
  posters: { x: 705, y: 254, count: current.accepted - current.spotlights, label: "Poster-only", colour: "#527d7c" },
  rejected: { x: 505, y: 345, count: current.rejected, label: "Rejected", colour: "#7c8491" },
  postDesk: { x: 340, y: 410, count: current.postReviewDeskRejected, label: "Desk-rejected", colour: "#96858a" },
  preDesk: { x: 177, y: 410, count: current.preReviewDeskRejected, label: "Desk-rejected", colour: "#96858a" },
} as const;

type NodeKey = keyof typeof nodes;
const flows: { from: NodeKey; to: NodeKey; count: number; offset: number }[] = [
  { from: "submissions", to: "reviewed", count: current.reviewed, offset: 0 },
  { from: "submissions", to: "preDesk", count: current.preReviewDeskRejected, offset: current.reviewed },
  { from: "reviewed", to: "ranked", count: current.ranked, offset: 0 },
  { from: "reviewed", to: "postDesk", count: current.postReviewDeskRejected, offset: current.ranked },
  { from: "ranked", to: "accepted", count: current.accepted, offset: 0 },
  { from: "ranked", to: "rejected", count: current.rejected, offset: current.accepted },
  { from: "accepted", to: "spotlights", count: current.spotlights, offset: 0 },
  { from: "accepted", to: "posters", count: current.accepted - current.spotlights, offset: current.spotlights },
];

function ribbon(from: NodeKey, to: NodeKey, count: number, offset: number) {
  const a = nodes[from];
  const b = nodes[to];
  const x = a.x + nodeWidth;
  const y = a.y + offset * scale;
  const h = count * scale;
  const mid = (x + b.x) / 2;
  return `M ${x} ${y} C ${mid} ${y}, ${mid} ${b.y}, ${b.x} ${b.y} L ${b.x} ${b.y + h} C ${mid} ${b.y + h}, ${mid} ${y + h}, ${x} ${y + h} Z`;
}

function SubmissionFlow() {
  return (
    <figure className="min-w-0" aria-labelledby="review-flow-heading">
      <h3 id="review-flow-heading" className="text-sm font-semibold text-ink">2026 review process</h3>
      <svg viewBox="0 0 870 550" role="img" aria-labelledby="review-flow-title review-flow-description" className="mt-2 hidden w-full sm:block">
        <title id="review-flow-title">2026 submission and review flow</title>
        <desc id="review-flow-description">
          79 submissions: 1 desk-rejected before review for failure to ensure double-blind, and 78 reviewed by a committee of 91 reviewers.
          After review, 6 desk-rejected and 72 ranked: 53 accepted and 19 rejected.
          Reported desk-rejection reasons: {deskRejectionReasons.map(({ count, label }) => `${count} ${label}`).join("; ")}.
          The 53 accepted papers include 47 poster-only presentations and 6 spotlights or orals,
          with a thin branch marking 1 best paper among the spotlights. Ribbon widths are proportional to paper counts.
        </desc>
        <defs>
          <marker id="reviewer-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#527d7c" />
          </marker>
        </defs>
        <g aria-hidden="true">
          <circle cx="180" cy="42" r="20" fill="#f5f7fc" stroke="#b8c2cc" />
          <Users x="170" y="32" width="20" height="20" stroke="#527d7c" strokeWidth="1.6" />
          <text x="212" y="40" fill="#40464c" fontSize="16" fontWeight="500">{current.reviewers} reviewers</text>
          <text x="212" y="59" fill="#626a73" fontSize="13">Programme committee</text>
          <path d="M 180 62 L 180 80" stroke="#527d7c" strokeWidth="1.2" markerEnd="url(#reviewer-arrow)" />
        </g>
        {flows.map(({ from, to, count, offset }) => (
          <path key={to} d={ribbon(from, to, count, offset)} fill={nodes[to].colour} fillOpacity="0.23">
            <title>{`${nodes[from].label} → ${nodes[to].label}: ${count} papers`}</title>
          </path>
        ))}
        {Object.entries(nodes).map(([key, node]) => {
          const below = key === "preDesk" || key === "postDesk";
          const labelY = below ? 450 : node.y - 34;
          return (
            <g key={key}>
              <rect x={node.x} y={node.y} width={nodeWidth} height={node.count * scale} rx="1" fill={node.colour} />
              <text x={node.x} y={labelY} fill="#212326" fontSize={below ? "21" : "25"} fontWeight="500">{node.count}</text>
              <text x={node.x} y={labelY + 23} fill="#40464c" fontSize="16">{node.label}</text>
              {below && <text x={node.x} y={labelY + 42} fill="#626a73" fontSize="14">{key === "preDesk" ? "Before review" : "After review"}</text>}
              {key === "preDesk" && (
                <text x={node.x} y={labelY + 64} fill="#626a73" fontSize="13" data-pre-review-reason="true">
                  <tspan x={node.x}>Failure to ensure</tspan>
                  <tspan x={node.x} dy="18">double-blind</tspan>
                </text>
              )}
            </g>
          );
        })}
        <g data-desk-rejection-reasons="true">
          <path d={`M ${nodes.postDesk.x + nodeWidth} ${nodes.postDesk.y + nodes.postDesk.count * scale / 2} H 480 V 503`} fill="none" stroke="#96858a" strokeWidth="1" />
          <text x="510" y="426" fill="#626a73" fontSize="13" fontWeight="500">Reported reasons</text>
          {deskRejectionReasons.map(({ count, label }, index) => (
            <g key={label} data-desk-reason={count}>
              <line x1="480" x2="499" y1={451 + index * 26} y2={451 + index * 26} stroke="#96858a" strokeWidth="1" />
              <text x="510" y={456 + index * 26} fill="#40464c" fontSize="14"><tspan fontWeight="500">{count}</tspan>{" "}{label}</text>
            </g>
          ))}
        </g>
        <g data-best-paper-branch="true">
          <path d={`M ${nodes.spotlights.x + nodeWidth} ${nodes.spotlights.y + scale / 2} C 727 133.3, 722 176, 737 176`} fill="none" stroke="#527d7c" strokeWidth="1.3" />
          <Trophy x="744" y="166" width="20" height="20" stroke="#527d7c" strokeWidth="1.5" aria-hidden="true" />
          <text x="772" y="181" fill="#626a73" fontSize="14">{current.bestPaperAwards} best paper</text>
        </g>
      </svg>

      <div className="mt-5 space-y-3 text-sm sm:hidden">
        <div className="border-l-2 border-brand-200 pl-3">
          <p className="font-medium text-ink">{current.submissions} submissions</p>
          <p className="mt-1 text-xs leading-5 text-slate-2">{current.preReviewDeskRejected} desk-rejected before review<br />Failure to ensure double-blind</p>
        </div>
        <ArrowDown className="ml-2 size-3.5 text-slate-3" aria-hidden="true" />
        <div className="border-l-2 border-brand-200 pl-3">
          <p className="font-medium text-ink">{current.reviewed} papers reviewed · {current.reviewers} reviewers</p>
          <p className="mt-1 text-xs leading-5 text-slate-2">{current.postReviewDeskRejected} desk-rejected after review · {current.ranked} ranked</p>
          <div className="mt-3 border-l border-mist pl-3 text-xs leading-5 text-slate-2" data-desk-rejection-reasons-mobile="true">
            <p className="font-medium">Reported reasons</p>
            <ul className="mt-1 space-y-1">
              {deskRejectionReasons.map(({ count, label }) => <li key={label}><span className="font-medium text-ink">{count}</span>{" "}{label}</li>)}
            </ul>
          </div>
        </div>
        <ArrowDown className="ml-2 size-3.5 text-slate-3" aria-hidden="true" />
        <div className="grid grid-cols-2 gap-4">
          <div className="border-l-2 border-teal-200 pl-3">
            <p className="font-medium text-ink">{current.accepted} accepted</p>
            <p className="mt-1 text-xs leading-5 text-slate-2">{current.accepted - current.spotlights} poster-only<br />{current.spotlights} spotlights / orals</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-2" data-best-paper-mobile="true">
              <span className="w-4 shrink-0 border-t border-teal-700/60" aria-hidden="true" />
              <Trophy className="size-3.5 shrink-0 text-teal-700" aria-hidden="true" />
              <span className="whitespace-nowrap">{current.bestPaperAwards} best paper</span>
            </div>
          </div>
          <div className="border-l-2 border-slate-4 pl-3"><p className="font-medium text-ink">{current.rejected} rejected</p></div>
        </div>
      </div>
      <figcaption className="mt-4 text-xs leading-5 text-slate-2">
        Spotlights / orals are included in the {current.accepted} accepted papers.
      </figcaption>
    </figure>
  );
}

export function WorkshopStats() {
  const comparisons = [
    { label: "Submissions", before: previous.submissions, after: current.submissions, provisional: previous.submissionsProvisional },
    { label: "Accepted papers", before: previous.accepted, after: current.accepted, provisional: false },
  ];

  return (
    <section id="workshop-stats" aria-labelledby="workshop-stats-heading" className="scroll-mt-28 border-b border-mist bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-4xl" data-review-sankey="true">
        <SubmissionFlow />
      </div>
      <div className="mt-8 grid gap-8 border-t border-mist pt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" data-review-details="true">
        <ReviewScoreDistribution />
        <div className="min-w-0 border-t border-mist pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8" data-review-metrics="true">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="workshop-stats-heading" className="display text-xl font-semibold text-ink">Submissions and review outcomes</h2>
          <Link href={site.openReviewUrl} className="text-xs text-slate-2 underline decoration-mist underline-offset-4 transition hover:text-brand">Decisions in OpenReview</Link>
        </div>
        <div className="mt-6 space-y-6" data-metrics-row="true">
          <div className="min-w-0">
          <table className="w-full text-left text-sm tabular-nums">
            <caption className="sr-only">Submission and acceptance counts by workshop edition</caption>
            <thead className="border-b border-mist text-xs font-medium text-slate-2">
              <tr><th scope="col" className="pb-3 font-medium">Metric</th><th scope="col" className="pb-3 text-right font-medium">{previous.year}</th><th scope="col" className="pb-3 pl-5 text-right font-medium">{current.year}</th></tr>
            </thead>
            <tbody>
              {comparisons.map(({ label, before, after, provisional }) => (
                <tr key={label} className="border-b border-mist/60">
                  <th scope="row" className="py-3 font-normal text-slate-1">{label}</th>
                  <td className="py-3 text-right text-slate-2">{before}{provisional ? "*" : ""}</td>
                  <td className="py-3 pl-5 text-right font-semibold text-ink">{after}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="min-w-0 border-t border-mist pt-5">
            <h3 className="text-xs font-medium text-slate-2">Growth from the previous edition</h3>
            <dl className="mt-4 space-y-3 text-sm tabular-nums">
              {comparisons.map(({ label, before, after, provisional }) => (
                <div key={label} className="flex justify-between gap-4"><dt className="text-slate-1">{label}</dt><dd className="font-medium text-ink">{provisional ? "≈ " : ""}{yoyGrowth(after, before)}</dd></div>
              ))}
            </dl>
          </div>
          <div className="min-w-0 border-t border-mist pt-5">
            <dl className="space-y-3 text-sm tabular-nums">
              {[
                { label: "Papers reviewed", value: current.reviewed },
                { label: "Reviewers", value: current.reviewers },
                { label: "Acceptance rate", value: `${(current.accepted / current.submissions * 100).toFixed(1)}%` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4"><dt className="text-slate-1">{label}</dt><dd className="font-medium text-ink">{value}</dd></div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-5 text-slate-2">Acceptance rate is based on all {current.submissions} submissions.</p>
          </div>
        </div>
        <p className="mt-6 text-xs leading-5 text-slate-2">
          Organiser-confirmed 2025 counts: <Link href="/previous-editions/copenhagen" className="underline decoration-mist underline-offset-4 hover:text-brand">29 accepted papers</Link> from 37 submissions (78.4% acceptance).
        </p>
        </div>
      </div>
      </div>
    </section>
  );
}
