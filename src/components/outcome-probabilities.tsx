import { ModelDetailsDialog } from "@/components/model-details-dialog";
import model from "@/content/outcome-probabilities.json";

const percent = (value: number) => `${(100 * value).toFixed(1)}%`;
const interval = (values: number[]) => `${(100 * values[0]).toFixed(1)}–${(100 * values[1]).toFixed(1)}%`;

export function OutcomeProbabilities() {
  return (
    <div id="outcome-probabilities" className="min-w-0 border-t border-mist pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8" aria-labelledby="outcome-probabilities-heading">
      <h3 id="outcome-probabilities-heading" className="text-sm font-semibold text-ink">Outcome probabilities</h3>
      <p className="mt-2 text-xs leading-5 text-slate-2">Per submission · Pooled estimates from the 2025 and 2026 editions.</p>
      <table className="mt-5 w-full text-left text-xs tabular-nums sm:text-sm">
        <caption className="sr-only">Posterior mean probabilities and 95% equal-tailed credible intervals for the pooled historical rates</caption>
        <thead className="border-b border-mist text-xs text-slate-2"><tr><th scope="col" className="pb-3 font-medium">Outcome</th><th scope="col" className="pb-3 pl-2 text-right font-medium">Probability</th><th scope="col" className="pb-3 pl-2 text-right font-medium">95% CrI</th></tr></thead>
        <tbody>{model.outcomes.map((outcome) => <tr key={outcome.id} data-outcome={outcome.id} className="border-b border-mist/60"><th scope="row" className="py-4 font-normal text-slate-1">{outcome.label}</th><td className="py-4 pl-2 text-right font-medium text-ink">{percent(outcome.mean)}</td><td className="whitespace-nowrap py-4 pl-2 text-right text-xs text-slate-2">{interval(outcome.interval)}</td></tr>)}</tbody>
      </table>
      <p className="mt-4 text-xs leading-5 text-slate-2">Rejection includes desk rejections. Spotlights and awards are included in acceptance and can overlap; the four rows do not sum to 100%.</p>
      <p className="mt-3 text-xs leading-5 text-slate-2">A Beta–Binomial model updates a Jeffreys Beta(½, ½) prior with each edition. Spotlight and award rates are estimated among accepted papers, then multiplied by the acceptance rate, propagating uncertainty.</p>
      <p className="mt-3 text-xs leading-5 text-slate-2">These historical baselines assume common rates across editions. The 95% credible intervals describe uncertainty in those rates, conditional on the organiser-supplied counts. They do not account for changing selection policies or predict an individual paper&rsquo;s outcome.</p>
      <ModelDetailsDialog>
        <div className="space-y-4">
          <table className="w-full text-left tabular-nums"><caption className="mb-2 text-left font-medium">Observed counts</caption><thead><tr className="border-b border-mist"><th scope="col" className="pb-2 font-medium">Edition</th><th scope="col" className="pb-2 text-right font-medium">2025</th><th scope="col" className="pb-2 text-right font-medium">2026</th></tr></thead><tbody>{[
            ["Submissions", model.editions[0].submissions, model.editions[1].submissions],
            ["Accepted", model.editions[0].accepted, model.editions[1].accepted],
            ["Rejected, incl. desk", model.editions[0].submissions-model.editions[0].accepted, model.editions[1].submissions-model.editions[1].accepted],
            ["Spotlights / orals", model.editions[0].spotlights, model.editions[1].spotlights],
            ["Best-paper awards", model.editions[0].bestPaperAwards, model.editions[1].bestPaperAwards],
          ].map(([label,a,b]) => <tr key={label} className="border-b border-mist/60"><th scope="row" className="py-2 font-normal">{label}</th><td className="py-2 text-right">{a}</td><td className="py-2 text-right">{b}</td></tr>)}</tbody></table>
          <p>The organisers confirm 29 accepted papers from 37 submissions in 2025.</p>
          <p>For each binomial likelihood, k ∈ &#123;0, …, n&#125; and p ∈ [0, 1]. Updating Beta(a, b) with k successes in n trials gives Beta(a + k, b + n − k). The prior is used once, before the first edition.</p>
          <p className="font-mono text-[11px] leading-6">p<sub>A</sub> | data ∼ Beta(82.5, 34.5)<br />q<sub>S|A</sub> | data ∼ Beta(14.5, 68.5)<br />q<sub>B|A</sub> | data ∼ Beta(3.5, 79.5)<br />p<sub>R</sub> = 1 − p<sub>A</sub>; p<sub>S</sub> = p<sub>A</sub>q<sub>S|A</sub>; p<sub>B</sub> = p<sub>A</sub>q<sub>B|A</sub></p>
          <p>Acceptance and each conditional rate have independent priors within their two-stage submodel. We calculate each marginal outcome separately: no independence between spotlight and award status is assumed, and their joint probability is not estimated. Product distributions are integrated numerically; they are not approximated as Beta or normal distributions.</p>
          <p>Table values are posterior means, also the predictive probabilities for one exchangeable submission. Intervals use the 2.5th and 97.5th posterior percentiles. Direct binomial future counts have Beta–Binomial predictions on &#123;0, …, m&#125;; spotlight and award counts require the nested predictive model.</p>
          <p>Observed acceptance rates were {percent(model.editions[0].accepted/model.editions[0].submissions)} in 2025 and {percent(model.editions[1].accepted/model.editions[1].submissions)} in 2026. Two editions cannot reliably establish variation between years. Award and spotlight quotas may change, so these pooled intervals are not forecasts for a future edition.</p>
          <p>Prior sensitivity: with a uniform Beta(1, 1) prior at each stage, the estimates are {model.sensitivityUniformPrior.outcomes.map((o) => `${o.label.toLowerCase()} ${percent(o.mean)}`).join(", ")}.</p>
          <p>Score curves use the 2026 export only. They are descriptive truncated-normal fits, separate from the count model; no first-edition score data or score-conditioned outcome model is available here.</p>
          <p>Methods: <a href="https://stat210a.berkeley.edu/fall-2025/reader/bayes-interpretation.html" className="underline">Jeffreys prior</a>; <a href="https://www.stat.cmu.edu/~brian/720/week01/Binomial-StatSci.pdf" className="underline">binomial intervals</a>; <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.truncnorm.html" className="underline">bounded normal density</a>.</p>
        </div>
      </ModelDetailsDialog>
    </div>
  );
}
