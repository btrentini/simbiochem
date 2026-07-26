import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { navLinks, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-slate-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 grid-faint"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display text-2xl font-semibold text-white">
              SIMBIOCHEM <span className="text-teal-300">II</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6">
              {site.tagline}. A community-driven academic workshop at NeurIPS
              2026 in Sydney, Australia.
            </p>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 hover:text-teal-200"
            >
              {site.contactEmail}
              <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div>
            <p className="eyebrow text-teal-400">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-teal-400">Participate</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/call-for-papers" className="hover:text-white">
                  Call for papers
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-white">
                  Join the Programme Committee
                </Link>
              </li>
              <li>
                <a href={`mailto:${site.contactEmail}`} className="hover:text-white">
                  Become a sponsor
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {"2026"} SIMBIOCHEM. Independently organised; not affiliated with
            or endorsed by any sponsor or institution.
          </p>
          <p>{site.venueShort} · Day and room confirmed by NeurIPS closer to the event.</p>
        </div>
        <p className="mt-3 text-[0.68rem] leading-5 text-slate-3">
          Imagery via Wikimedia Commons — hero: GFP structure by Richard Wheeler (CC BY-SA 3.0);
          Sydney photo by Benh Lieu Song (CC BY-SA 4.0).
        </p>
      </div>
    </footer>
  );
}
