#!/usr/bin/env python3
"""Build anonymous score curves, conjugate outcome estimates and a PDF.

Usage: python scripts/build-review-score-distribution.py /path/to/decisions.csv
Requires numpy, scipy and matplotlib. Publishes aggregate data only.
See docs/review-statistics.md for the model, assumptions and validation.
"""
import argparse
import collections
import csv
import hashlib
import json
import math
from pathlib import Path
import statistics

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from scipy.integrate import quad
from scipy.optimize import brentq, minimize
from scipy.stats import beta, truncnorm

ROOT = Path(__file__).resolve().parents[1]
GROUPS = [
    ("Accept", "accepted", "Accepted", "#006639"),
    ("Reject", "rejected", "Rejected", "#404f78"),
    ("Desk reject", "desk-rejected", "Desk-rejected", "#a57400"),
]


def fit_scores(scores):
    """MLE of a normal density normalised on the fixed score support [1, 5]."""
    sample = np.asarray(scores)
    def objective(parameters):
        mu, log_sd = parameters
        sd = np.exp(log_sd)
        return -float(truncnorm.logpdf(sample, (1-mu)/sd, (5-mu)/sd, loc=mu, scale=sd).sum())
    fits = [minimize(objective, [np.mean(sample), np.log(sd)], method="Nelder-Mead",
                    options={"maxiter":4000, "xatol":1e-9, "fatol":1e-9})
            for sd in (0.5, 1.0, 2.0)]
    if not all(fit.success for fit in fits):
        raise ValueError("Truncated-normal optimisation did not converge")
    if max(fit.fun for fit in fits) - min(fit.fun for fit in fits) > 1e-6:
        raise ValueError("Truncated-normal starts disagree")
    result = min(fits, key=lambda fit: fit.fun)
    mu, sd = float(result.x[0]), float(np.exp(result.x[1]))
    rv = truncnorm((1-mu)/sd, (5-mu)/sd, loc=mu, scale=sd)
    assert abs(quad(rv.pdf, 1, 5)[0]-1) < 1e-9
    assert rv.pdf(0.99) == rv.pdf(5.01) == 0
    grid = np.linspace(1, 5, 161)
    return {"family":"truncated-normal", "method":"maximum likelihood",
            "location":mu, "scale":sd, "support":[1,5],
            "curve":[{"score":round(float(x),3), "density":float(rv.pdf(x))} for x in grid]}


def beta_summary(successes, trials, prior=0.5):
    assert 0 <= successes <= trials
    a, b = successes+prior, trials-successes+prior
    rv = beta(a,b)
    return {"alpha":a, "beta":b, "mean":float(rv.mean()),
            "interval":[float(v) for v in rv.ppf([0.025,0.975])]}


def product_summary(acceptance, conditional):
    """Exact mean; equal-tail quantiles via quadrature of the product CDF.

    F_PQ(z) = F_P(z) + integral_z^1 f_P(p) F_Q(z/p) dp.
    A product of independent Beta parameters is generally NOT Beta.
    """
    p = beta(acceptance['alpha'], acceptance['beta'])
    q = beta(conditional['alpha'], conditional['beta'])
    def cdf(z):
        if z <= 0: return 0.0
        if z >= 1: return 1.0
        return float(p.cdf(z) + quad(lambda x:p.pdf(x)*q.cdf(z/x),z,1,
                                    epsabs=1e-10, epsrel=1e-9, limit=150)[0])
    interval = [brentq(lambda z:cdf(z)-target,1e-10,1-1e-10,xtol=1e-10)
                for target in (0.025,0.975)]
    for value, target in zip(interval, (0.025,0.975)):
        assert abs(cdf(value)-target) < 1e-7
    return {"mean":acceptance['mean']*conditional['mean'], "interval":interval}


def outcome_model(editions, prior=0.5):
    n = sum(e['submissions'] for e in editions)
    accepted = sum(e['accepted'] for e in editions)
    spotlights = sum(e['spotlights'] for e in editions)
    awards = sum(e['bestPaperAwards'] for e in editions)
    p = beta_summary(accepted,n,prior)
    q = beta_summary(spotlights,accepted,prior)
    r = beta_summary(awards,accepted,prior)
    outcomes = [
        {"id":"accepted", "label":"Acceptance", "count":accepted, "mean":p['mean'], "interval":p['interval']},
        {"id":"rejected", "label":"Rejection", "count":n-accepted, "mean":1-p['mean'], "interval":[1-p['interval'][1],1-p['interval'][0]]},
        {"id":"spotlight", "label":"Spotlight / oral", "count":spotlights, **product_summary(p,q)},
        {"id":"best-paper", "label":"Best-paper award", "count":awards, **product_summary(p,r)},
    ]
    assert abs(outcomes[0]['mean']+outcomes[1]['mean']-1) < 1e-14
    for outcome in outcomes:
        assert 0 < outcome['interval'][0] < outcome['mean'] < outcome['interval'][1] < 1
    assert outcomes[2]['mean'] < p['mean'] and outcomes[3]['mean'] < p['mean']
    return {"submissions":n, "accepted":accepted, "spotlights":spotlights, "awards":awards,
            "parameters":{"acceptance":p, "spotlightGivenAcceptance":q, "awardGivenAcceptance":r},
            "outcomes":outcomes}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv",type=Path)
    parser.add_argument("--preview",type=Path)
    args=parser.parse_args()
    raw=args.csv.read_bytes()
    with args.csv.open(newline="",encoding="utf-8-sig") as source:
        rows=list(csv.DictReader(source))
    if len({row['number'] for row in rows}) != len(rows):
        raise ValueError("Duplicate paper identifiers")
    if any(row['Decision'] not in {g[0] for g in GROUPS} for row in rows):
        raise ValueError("Unrecognised decision")
    groups=[]
    for decision,group_id,label,colour in GROUPS:
        selected=[row for row in rows if row['Decision']==decision]
        scores=[]
        for row in selected:
            value=row['average rating'].strip()
            if value in {'','N/A','NA'}: continue
            score=float(value)
            if not math.isfinite(score) or not 1 <= score <= 5:
                raise ValueError('Score outside 1–5')
            if int(row['num submitted Reviewers']) <= 0:
                raise ValueError('Score without a review')
            if not float(row['min rating']) <= score <= float(row['max rating']):
                raise ValueError('Mean outside recorded review range')
            scores.append(score)
        frequency=collections.Counter(scores)
        groups.append({'id':group_id,'label':label,'colour':colour,'papers':len(selected),
                       'scored':len(scores),'missing':len(selected)-len(scores),
                       'mean':round(statistics.mean(scores),4),'median':statistics.median(scores),
                       'frequencies':[{'score':s,'count':c} for s,c in sorted(frequency.items())],
                       'fit':fit_scores(scores)})
    data={'sourceField':'average rating','sourceSha256':hashlib.sha256(raw).hexdigest(),
          'scale':[1,5],'scoredPapers':sum(g['scored'] for g in groups),'groups':groups}
    inputs=json.loads((ROOT/'src/content/workshop-editions.json').read_text())
    editions=list(inputs.values())
    for edition in editions:
        assert 0 <= edition['spotlights'] <= edition['accepted'] <= edition['submissions']
        assert 0 <= edition['bestPaperAwards'] <= edition['accepted']
    current=inputs['current']
    assert [g['papers'] for g in groups] == [current['accepted'],current['rejected'],current['postReviewDeskRejected']]
    assert len(rows)+current['preReviewDeskRejected'] == current['submissions']
    pooled=outcome_model(editions)
    # Sequential conjugate updating must equal pooling, with the prior used once.
    first,second=editions
    for field,denominator,param in [('accepted','submissions','acceptance'),('spotlights','accepted','spotlightGivenAcceptance'),('bestPaperAwards','accepted','awardGivenAcceptance')]:
        a1=0.5+first[field]; b1=0.5+first[denominator]-first[field]
        assert a1+second[field] == pooled['parameters'][param]['alpha']
        assert b1+second[denominator]-second[field] == pooled['parameters'][param]['beta']
    model={'prior':{'family':'Beta','alpha':0.5,'beta':0.5},'credibleMass':0.95,
           'editions':editions, **pooled,
           'editionModels':[{'year':e['year'],**outcome_model([e])} for e in editions],
           'sensitivityUniformPrior':outcome_model(editions,1.0)}
    # Independent numerical check of the quadrature intervals by fixed-seed simulation.
    rng=np.random.default_rng(20260929)
    p=pooled['parameters']['acceptance']
    draws=rng.beta(p['alpha'],p['beta'],300000)
    for key,outcome_index in [('spotlightGivenAcceptance',2),('awardGivenAcceptance',3)]:
        conditional=pooled['parameters'][key]
        product=draws*rng.beta(conditional['alpha'],conditional['beta'],len(draws))
        assert np.max(np.abs(np.quantile(product,[.025,.975])-pooled['outcomes'][outcome_index]['interval'])) < .0015
    (ROOT/'src/content/review-score-distribution.json').write_text(json.dumps(data,indent=2)+'\n')
    (ROOT/'src/content/outcome-probabilities.json').write_text(json.dumps(model,indent=2)+'\n')

    from matplotlib.lines import Line2D
    fig,ax=plt.subplots(figsize=(7.0,5.4))
    for row,group in enumerate(groups):
        baseline=row*1.5
        xs=np.array([p['score'] for p in group['fit']['curve']])
        shape=np.array([p['density'] for p in group['fit']['curve']])
        curve=baseline-shape/shape.max()*.58
        ax.fill_between(xs,baseline,curve,color=group['colour'],alpha=.08)
        ax.plot(xs,curve,color=group['colour'],linewidth=1.3)
        ax.vlines(group['mean'],baseline-.62,baseline,color=group['colour'],linewidth=.9,linestyle=(0,(4,3)))
        lo,hi=group['frequencies'][0]['score'],group['frequencies'][-1]['score']
        ax.hlines(baseline,lo,hi,color=group['colour'],linewidth=.9)
        ax.vlines([lo,hi],baseline-.04,baseline+.04,color=group['colour'],linewidth=1)
        for entry in group['frequencies']:
            ys=[baseline+.44+(i-(entry['count']-1)/2)*.038 for i in range(entry['count'])]
            ax.scatter([entry['score']]*entry['count'],ys,s=7,color=group['colour'],linewidths=0)
    ax.set_xlim(.98,5.02); ax.set_ylim(3.96,-.68)
    ax.set_xticks([1,2,3,4,5])
    ax.set_yticks([i*1.5 for i in range(len(groups))],
                  [f"{g['label']} (n = {g['scored']})\nMean {g['mean']:.2f}\nMin {g['frequencies'][0]['score']:g} · Max {g['frequencies'][-1]['score']:g}" for g in groups])
    ax.set_xlabel('Average review score per paper',fontsize=11)
    ax.set_ylabel('Category',fontsize=11)
    ax.set_axisbelow(True); ax.grid(axis='x',color='lightgray',linewidth=.5,linestyle=':')
    for side in ('left','bottom'):
        ax.spines[side].set_position(('outward',1)); ax.spines[side].set_linewidth(.8)
    for side in ('top','right'): ax.spines[side].set_visible(False)
    ax.tick_params(labelsize=9,width=.8)
    ax.tick_params(axis='y',length=0,pad=8)
    ax.legend(handles=[Line2D([],[],color='#2f4858',linestyle='--',linewidth=1,label='Observed mean'),
                       Line2D([],[],color='#2f4858',marker='|',linewidth=1,label='Min–max range'),
                       Line2D([],[],color='#2f4858',marker='o',markersize=3,linestyle='none',label='Individual paper')],
              loc='upper center',bbox_to_anchor=(0,-.19,1,.1),mode='expand',ncol=3,frameon=False,fontsize=9)
    fig.subplots_adjust(left=.29,right=.99,top=.98,bottom=.18)
    fig.savefig(ROOT/'public/figures/review-score-distribution.pdf',dpi=600,bbox_inches='tight',metadata={
        'Title':'SIMBIOCHEM 2026 review score distributions',
        'Subject':'Category rows with equal-height fitted normal score curves bounded to [1,5], observed mean lines and minimum-maximum bars. Anonymous dots below each curve show exact scores; vertical stacking is for separation only. These are not outcome probabilities. 53 accepted, 19 rejected, 6 desk-rejected scored papers; one unscored desk rejection excluded.'})
    if args.preview: fig.savefig(args.preview,dpi=180,bbox_inches='tight')
    plt.close(fig)
    print(json.dumps({'scored':data['scoredPapers'],'outcomes':pooled['outcomes'],
                      'checks':'support, normalisation, fit convergence, count reconciliation, sequential Bayes updates, product CDF quantiles and Monte Carlo cross-check passed'},indent=2))

if __name__=='__main__': main()
