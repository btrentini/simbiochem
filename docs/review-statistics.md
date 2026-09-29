# Review statistics

The homepage uses `src/content/workshop-editions.json` for counts. The private 2026 CSV supplies only aggregate paper-average score frequencies. Run:

```sh
python scripts/build-review-score-distribution.py /path/to/decisions.csv
```

Requires NumPy, SciPy and Matplotlib. This regenerates both aggregate JSON outputs and `public/figures/review-score-distribution.pdf`. No paper identifiers, reviews or author names are published.

## Inputs and estimand

| Edition | Submissions | Accepted | Rejected incl. desk | Spotlights | Best-paper awards |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2025 | 37 (organiser-confirmed) | 29 | 8 (inferred) | 8 | 2 |
| 2026 | 79 | 53 | 26 | 6 | 1 |

2025: organisers' confirmed 29 accepted out of 37 submitted (29 September 2026); published first-edition counts and two distinct award winners in `src/content/previous-edition.ts` and `/previous-editions/copenhagen`. The 8 non-acceptances are inferred by subtraction; treating these as rejections assumes no separately counted withdrawals. This should be revisited when the complete first-edition decision export is available.

2026: organisers' `stats.txt`, reconciled with the 78-row export: 53 accepted, 19 rejected, 6 desk-rejected after review, plus 1 unscored desk rejection before review. Spotlights and the award use the organisers' supplied counts. The original notes' incompatible desk-rejection subtotal is not added again.

Estimand: the common historical marginal probability per submitted paper under exchangeability across the two editions. Outcomes are not four exclusive categories: spotlight and award imply acceptance and can overlap. The overlap in 2025 is unavailable, so no joint spotlight/award probability is estimated.

## Conjugate outcome model

For each edition e, A_e | N_e,p_A ~ Binomial(N_e,p_A). Independently of p_A in each two-stage submodel, q_S and q_B have their own Beta priors:

- S_e | A_e,q_S ~ Binomial(A_e,q_S).
- B_e | A_e,q_B ~ Binomial(A_e,q_B).

Use the Jeffreys Beta(1/2,1/2) prior for each binomial parameter. This is a reference prior for each chosen parameter, not a claim of a joint Jeffreys prior for every possible reparameterisation. The two conditional likelihoods are used separately for marginal inference; their product is not asserted to be a joint likelihood for overlapping spotlight and award indicators.

Binomial counts have support {0,...,n}; Beta parameters have support [0,1]. Add successes and failures to the prior once, sequentially across the editions. This produces:

- p_A | data ~ Beta(82.5,34.5).
- q_S | data ~ Beta(14.5,68.5).
- q_B | data ~ Beta(3.5,79.5).

p_R = 1-p_A; p_S = p_A q_S; p_B = p_A q_B. For each marginal product, the relevant acceptance and conditional parameter posteriors factorise under that two-stage model. No independence assumption between q_S and q_B is needed for these marginal estimates. A product of Betas is not generally Beta.

Means of products are products of the relevant posterior means. Equal-tailed 95% credible intervals come from quadrature and root finding using

F_PQ(z) = F_P(z) + integral from z to 1 of f_P(p) F_Q(z/p) dp.

The table reports posterior means (equivalently the posterior-predictive probabilities for one exchangeable submission). A future count of direct binomial successes in m trials is Beta–Binomial on {0,...,m}; spotlight/award counts require nested predictive sampling, not a single Beta–Binomial using a moment-matched product. Rate credible intervals are not predictive count intervals.

The common-rate assumption is substantive: acceptance was 78.4% in the organiser-confirmed 2025 data versus 67.1% in 2026. Fixed slots, selection policies, cohort quality and submission growth can all invalidate a future-edition forecast. Two editions do not support a stable estimate of between-edition variance. The displayed result is therefore explicitly a historical pooled baseline, not an individual-paper or next-edition forecast. Intervals condition on the organiser-confirmed counts; they do not represent uncertainty in the count provenance.

Uniform Beta(1,1) prior sensitivity and separate-edition estimates are generated alongside the pooled result. The uniform-prior means are disclosed in the on-page methods. The first edition is not reused as both prior data and likelihood data.

## Score curves

These are descriptive continuous approximations for discrete averages, using the 2026 data only. Fit each category by maximum likelihood with a normal density truncated and normalised on [1,5]:

f(x|mu,sigma) = phi((x-mu)/sigma) / {sigma [Phi((5-mu)/sigma)-Phi((1-mu)/sigma)]}, for 1 <= x <= 5; zero elsewhere.

The normalising constant is included during fitting, not applied after fitting an unbounded normal. Optimise mu and log(sigma) from three initial scales and require agreement. The fitted location and scale refer to the underlying normal, not the truncated distribution's moments. The six-paper desk-rejected fit is explicitly labelled as sparse. The curves are not a Bayesian score model, and neither normal–inverse-gamma conjugacy nor probabilities conditioned on review scores are claimed. Truncation changes the normal likelihood, so applying ordinary unbounded-normal conjugacy would be incorrect.

The underlying fitted density integrates to one, but the displayed curves are rescaled to equal height within separate category rows. The visible y-axis is categorical, not a numerical density axis. Category prevalence is shown through sample counts. Observed aggregate frequencies are retained in the source JSON and represented by the anonymous paper dots; the observed-counts dropdown has been removed. The full data and model explanation opens in an accessible, scrollable modal dialog. The initial unscored desk rejection contributes to rejection probability but never receives an invented score. The PDF and web SVG use the same fitted points.

## Validation

The generator checks CSV identity uniqueness, decisions, score range, submitted-review counts and min/mean/max consistency. It reconciles category and submission totals; checks fit convergence from multiple starts, density integrals and zero density outside support; checks nested outcome counts; proves sequential updates equal pooled updates; verifies rejection is the exact complement of acceptance; checks product-CDF quantiles against their target probabilities; and cross-checks product intervals with 300,000 fixed-seed independent posterior draws. These checks cover the mathematical model and data flow, rather than merely copying a rendering implementation.

## References

- [Published first-edition record](https://www.simbiochem.com/previous-editions/copenhagen).
- [Berkeley STAT 210A: derivation of the binomial Jeffreys prior](https://stat210a.berkeley.edu/fall-2025/reader/bayes-interpretation.html).
- [Brown, Cai and DasGupta (2001): Interval Estimation for a Binomial Proportion](https://www.stat.cmu.edu/~brian/720/week01/Binomial-StatSci.pdf).
- [SciPy: truncated normal support and parameterisation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.truncnorm.html).
- [Stan: posterior predictive sampling](https://mc-stan.org/docs/stan-users-guide/posterior-prediction.html).

## OpenReview check, 29 September 2026

The public venue metadata endpoint returned the first-edition venue `EurIPS.cc/2025/Workshop/SIMBIOCHEM`. Its metadata has `public_submissions`, `public_withdrawn_submissions` and `public_desk_rejected_submissions` set to false. Requests for the submission invitation and accepted venue notes returned HTTP 403 `ChallengeRequiredError`; the web submissions page likewise required browser verification. Therefore this check did not independently establish either total. The organisers explicitly confirmed 29 accepted from 37 submitted; the website identifies the counts as organiser-confirmed rather than claiming an OpenReview-verified total. The numerical model is unchanged.

## Mean lines and anonymous observations

Dashed vertical lines show the observed arithmetic mean of paper-average scores for each category, not the fitted normal location. Each anonymous dot is one scored paper at its exact recorded x-coordinate. Equal scores are stacked vertically, with each category's dots below its own fitted curve; dot height has no density interpretation. Dot titles contain only the score, with no paper name, identifier, author or link. Capped horizontal bars mark the observed minimum and maximum. Each category label lists its mean, minimum, maximum and sample size. The PDF uses the same categorical layout, observations and means.
