import Link from "next/link";
import distribution from "@/content/review-score-distribution.json";

function ScoreChart({ compact = false }: { compact?: boolean }) {
  const width = compact ? 400 : 640;
  const left = compact ? 135 : 170;
  const right = width - 16;
  const axis = 477;
  const x = (score: number) => left + ((score - 1) / 4) * (right - left);
  const id = compact ? "score-curves-mobile" : "score-curves-desktop";
  return (
    <svg viewBox={`0 0 ${width} 531`} className={compact ? "block w-full sm:hidden" : "hidden w-full sm:block"} role="img" aria-labelledby={`${id}-title ${id}-desc`} data-score-chart={compact ? "mobile" : "desktop"}>
      <title id={`${id}-title`}>Average review scores by decision category</title>
      <desc id={`${id}-desc`}>Categories on the y-axis; average review scores from 1 to 5 on the x-axis. {distribution.groups.map((g) => `${g.label}: ${g.scored} papers, mean ${g.mean.toFixed(2)}, minimum ${g.frequencies[0].score}, maximum ${g.frequencies[g.frequencies.length - 1].score}.`).join(" ")} Each category has an equal-height fitted normal curve, a dashed observed mean, a minimum-to-maximum bar, and anonymous paper dots beneath its curve.</desc>
      {[1, 2, 3, 4, 5].map((score) => <g key={score}><line x1={x(score)} x2={x(score)} y1="15" y2={axis} stroke="#dde1e6" strokeWidth="0.7" strokeDasharray="1.5 3" /><text x={x(score)} y={axis + 23} textAnchor="middle" fill="#626a73" fontSize="13">{score}</text></g>)}
      {distribution.groups.map((group, row) => {
        const baseline = 80 + row * 150;
        const peak = Math.max(...group.fit.curve.map((p) => p.density));
        const curve = group.fit.curve.map((p) => `${x(p.score)},${baseline - p.density / peak * 58}`).join(" L ");
        const min = group.frequencies[0].score;
        const max = group.frequencies[group.frequencies.length - 1].score;
        return <g key={group.id} data-score-group={group.id}>
          <text x={left - 12} y={baseline - 23} textAnchor="end" fill="#40464c" fontSize={compact ? "13" : "14"} fontWeight="500">{group.label}</text>
          <text x={left - 12} y={baseline - 4} textAnchor="end" fill="#40464c" fontSize="12">Mean {group.mean.toFixed(2)}</text>
          <text x={left - 12} y={baseline + 15} textAnchor="end" fill="#626a73" fontSize="11.5">Min {min} · Max {max}</text>
          <text x={left - 12} y={baseline + 34} textAnchor="end" fill="#626a73" fontSize="11.5">n = {group.scored}</text>
          <path d={`M ${left} ${baseline} L ${curve} L ${right} ${baseline} Z`} fill={group.colour} fillOpacity="0.08" />
          <path d={`M ${curve}`} fill="none" stroke={group.colour} strokeWidth="1.8" data-score-density={group.id} />
          <line x1={x(group.mean)} x2={x(group.mean)} y1={baseline - 62} y2={baseline} stroke={group.colour} strokeWidth="1.2" strokeDasharray="4 3" data-score-mean={group.mean}><title>{`Mean: ${group.mean.toFixed(2)}`}</title></line>
          <line x1={x(min)} x2={x(max)} y1={baseline} y2={baseline} stroke={group.colour} strokeWidth="1.2" data-score-range={`${min},${max}`} />
          {[min, max].map((score, index) => <line key={index} x1={x(score)} x2={x(score)} y1={baseline - 4} y2={baseline + 4} stroke={group.colour} strokeWidth="1.3"><title>{`${index === 0 ? "Minimum" : "Maximum"}: ${score}`}</title></line>)}
          {group.frequencies.flatMap(({ score, count }) => Array.from({ length: count }, (_, index) => (
            <circle key={`${score}-${index}`} cx={x(score)} cy={baseline + 44 + (index - (count - 1) / 2) * 3.8} r="1.7" fill={group.colour} data-score={score}><title>{`Score: ${score}`}</title></circle>
          )))}
        </g>;
      })}
      <path d={`M ${left - 1.3} 15 V ${axis + 1.3} H ${right}`} fill="none" stroke="#8b959e" strokeWidth="0.8" />
      <text x={(left + right) / 2} y={axis + 49} textAnchor="middle" fill="#40464c" fontSize="14.67">Average review score</text>
      <text transform="translate(14 240) rotate(-90)" textAnchor="middle" fill="#40464c" fontSize="14.67">Category</text>
    </svg>
  );
}

export function ReviewScoreDistribution() {
  return (
    <figure id="review-scores" aria-labelledby="review-scores-heading" className="min-w-0 scroll-mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 id="review-scores-heading" className="text-sm font-semibold text-ink">Review score distribution</h3>
        <Link href="/figures/review-score-distribution.pdf" className="text-xs text-slate-2 underline decoration-mist underline-offset-4 hover:text-brand">Download PDF</Link>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-2">2026 · Average review score per paper, on the 1–5 scale.</p>
      <div className="mt-5"><ScoreChart /><ScoreChart compact /></div>
      <figcaption className="mt-5 space-y-2 text-xs leading-5 text-slate-2">
        <p>Each row shows a fitted score distribution, its observed mean (dashed line) and minimum–maximum range (capped bar). Dots beneath each curve are individual papers; equal scores are stacked vertically.</p>
        <p>Normal curves are fitted within the 1–5 scale and displayed at equal height to compare their shapes. Curve height and dot stacking have no numerical y-axis meaning. The desk-rejected group has only six scored papers.</p>
        <p>78 scored papers. Six desk rejections occurred after review; the initial desk rejection has no review score and is excluded.</p>
      </figcaption>
    </figure>
  );
}
