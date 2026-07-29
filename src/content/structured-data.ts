import { site, themes } from "@/content/site";

/**
 * schema.org graph for the workshop, emitted once from the root layout.
 *
 * Deliberately conservative: every property below is a real property of the
 * type it sits on. Notably there is NO schema.org property for a paper
 * submission deadline, so the deadline lives in the description rather than in
 * an invented field.
 *
 * The exact day is still TBC between 11 and 12 December, so the event is
 * declared across that window and the description says so — better than
 * omitting dates entirely, which would forfeit event rich results.
 */
export function structuredData(siteUrl: string) {
  const base = siteUrl.replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "SIMBIOCHEM",
        alternateName:
          "SIMBIOCHEM Workshop on Machine Learning for Simulations in Biology and Chemistry",
        url: `${base}/`,
        logo: `${base}/simbiochemLogo.png`,
        email: site.contactEmail,
        description:
          "A workshop series bringing together machine learning, computational chemistry and biophysics to make molecular simulation faster and physically rigorous.",
        knowsAbout: themes,
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: "SIMBIOCHEM II",
        inLanguage: "en",
        publisher: { "@id": `${base}/#organization` },
      },
      {
        "@type": "Event",
        "@id": `${base}/#event`,
        name: "SIMBIOCHEM II — The 2nd Workshop on Machine Learning for Simulations in Biology and Chemistry",
        alternateName: "SIMBIOCHEM II",
        url: `${base}/`,
        description:
          "A NeurIPS 2026 workshop on machine learning for molecular simulation in biology and chemistry: learned potentials, differentiable and enhanced molecular dynamics, molecular foundation models, calibrated uncertainty and agentic, tool-calling scientific systems. The exact day is confirmed by NeurIPS closer to the conference. Papers are due 29 August 2026 and the workshop is non-archival.",
        image: `${base}/opengraph-image`,
        startDate: "2026-12-11",
        endDate: "2026-12-12",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        inLanguage: "en",
        isAccessibleForFree: false,
        keywords: themes.join(", "),
        organizer: { "@id": `${base}/#organization` },
        location: {
          "@type": "Place",
          name: "NeurIPS 2026, Sydney",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Sydney",
            addressRegion: "NSW",
            addressCountry: "AU",
          },
        },
        superEvent: {
          "@type": "Event",
          name: "NeurIPS 2026",
          url: "https://neurips.cc/Conferences/2026",
          startDate: "2026-12-06",
          endDate: "2026-12-13",
          location: {
            "@type": "Place",
            name: "Sydney, Australia",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Sydney",
              addressRegion: "NSW",
              addressCountry: "AU",
            },
          },
        },
      },
      {
        "@type": "Event",
        "@id": `${base}/previous-editions/copenhagen#event`,
        name: "SIMBIOCHEM I — The 1st Workshop on Machine Learning for Simulations in Biology and Chemistry",
        alternateName: "SIMBIOCHEM I",
        url: `${base}/previous-editions/copenhagen`,
        description:
          "The inaugural SIMBIOCHEM workshop at EurIPS 2025 in Copenhagen.",
        startDate: "2025-12-06",
        endDate: "2025-12-07",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        organizer: { "@id": `${base}/#organization` },
        location: {
          "@type": "Place",
          name: "EurIPS 2025, Copenhagen",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Copenhagen",
            addressCountry: "DK",
          },
        },
      },
    ],
  };
}
