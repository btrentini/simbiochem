import type { MetadataRoute } from "next";

import { site } from "@/content/site";

// Same resolution order as layout.tsx's metadataBase, minus any trailing slash
// so the joins below cannot produce "//".
const SITE_URL = (process.env.SITE_URL ?? site.website).replace(/\/+$/, "");

/**
 * Bump the relevant date when a page's content materially changes. Keep these
 * honest — a lastModified that moves on every deploy gets discounted.
 * /admin and /api are deliberately absent (see robots.ts).
 */
const lastModified = {
  home: new Date("2026-07-29"),
  callForPapers: new Date("2026-07-29"),
  volunteer: new Date("2026-07-29"),
  copenhagen: new Date("2026-07-27"),
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: lastModified.home,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      // The deadline page — the one most worth ranking while the CFP is open.
      url: `${SITE_URL}/call-for-papers`,
      lastModified: lastModified.callForPapers,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/volunteer`,
      lastModified: lastModified.volunteer,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/previous-editions/copenhagen`,
      lastModified: lastModified.copenhagen,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
