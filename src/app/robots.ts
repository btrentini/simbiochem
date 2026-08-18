import type { MetadataRoute } from "next";

import { site } from "@/content/site";

const SITE_URL = (process.env.SITE_URL ?? site.website).replace(/\/+$/, "");

/**
 * Everything public is crawlable, including by AI answer engines — for a
 * workshop those are a discovery channel, not a threat.
 *
 * /admin and /reviewer-guide set robots: { index: false } in their own metadata, but that only
 * helps after a crawler has already fetched the page; the disallow keeps it
 * out of the crawl. /api is disallowed because the route handlers return JSON
 * that would otherwise be indexed as thin content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/reviewer-guide"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
