import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

// Needs the Node runtime to read the logo off disk.
export const runtime = "nodejs";

export const alt =
  "SIMBIOCHEM II — Machine Learning for Simulations in Biology and Chemistry. A NeurIPS 2026 workshop in Sydney, Australia.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card. Next emits absolute og:image and twitter:image from this file
 * automatically (metadataBase is set in layout.tsx), so metadata must NOT also
 * declare openGraph.images or the two fight.
 *
 * next/og supports only a flexbox subset of CSS: every element with more than
 * one child needs an explicit display, and there is no text-wrap control — so
 * the tagline is split into fixed lines rather than left to wrap. Sizes are
 * chosen to stay legible when Slack renders the card around 360px wide (0.3x).
 */
export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/simbiochemLogo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#001965",
          backgroundImage:
            "linear-gradient(135deg, #0B2A8A 0%, #001965 45%, #030A24 100%)",
        }}
      >
        {/* teal wash, top right */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: -220,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 760,
            backgroundImage:
              "radial-gradient(circle at center, rgba(14,165,160,0.40) 0%, rgba(14,165,160,0) 70%)",
          }}
        />
        {/* green wash, bottom left */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: -260,
            left: -180,
            width: 660,
            height: 660,
            borderRadius: 660,
            backgroundImage:
              "radial-gradient(circle at center, rgba(118,185,0,0.22) 0%, rgba(118,185,0,0) 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "0 0 0 76px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 27,
              letterSpacing: 3,
              color: "#52d3c4",
              fontWeight: 600,
            }}
          >
            NEURIPS 2026 WORKSHOP · SYDNEY, AUSTRALIA
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 96,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            SIMBIOCHEM II
          </div>

          {/* Explicit lines — no reliance on wrapping. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 18,
              fontSize: 44,
              color: "#d7dced",
              lineHeight: 1.25,
            }}
          >
            <div style={{ display: "flex" }}>Machine Learning for Simulations</div>
            <div style={{ display: "flex" }}>in Biology &amp; Chemistry</div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 34,
              padding: "12px 26px",
              borderRadius: 999,
              backgroundColor: "rgba(118,185,0,0.16)",
              border: "2px solid rgba(118,185,0,0.45)",
              color: "#b6f04d",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            Call for papers open · deadline 29 Aug 2026
          </div>
        </div>

        {/* ImageResponse renders a plain <img>; next/image has no meaning here.
            Dimensions must be in `style` — the width/height attributes alone do
            not constrain it and the figure overflows the canvas. */}
        <img
          src={logoSrc}
          alt=""
          style={{
            width: 264,
            height: 396,
            objectFit: "contain",
            flexShrink: 0,
            marginRight: 76,
            marginLeft: 24,
          }}
        />
      </div>
    ),
    size,
  );
}
