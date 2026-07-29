import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { site } from "@/content/site";
import { structuredData } from "@/content/structured-data";

/**
 * Self-hosted via next/font rather than a <link> to fonts.googleapis.com.
 * The third-party stylesheet was render-blocking on two extra origins, so text
 * painted in a fallback face and then reflowed once the real fonts arrived.
 * next/font serves the files same-origin, preloads them, and emits a
 * size-adjusted fallback so the swap causes no visible layout shift.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VWS9V4TY11";
const SITE_URL = process.env.SITE_URL ?? site.website;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // The old default was 73 chars and truncated in results. This front-loads
    // "NeurIPS 2026 Workshop", the phrase people actually search for.
    default: "SIMBIOCHEM II · NeurIPS 2026 Workshop on ML for Simulation",
    template: "%s · SIMBIOCHEM II @ NeurIPS 2026",
  },
  description:
    "The 2nd SIMBIOCHEM Workshop at NeurIPS 2026 in Sydney — machine learning for molecular simulation in biology and chemistry. Papers due 29 August 2026.",
  applicationName: "SIMBIOCHEM",
  authors: [{ name: "SIMBIOCHEM organisers", url: SITE_URL }],
  creator: "SIMBIOCHEM organisers",
  publisher: "SIMBIOCHEM",
  alternates: { canonical: "/" },
  category: "science",
  keywords: [
    "SIMBIOCHEM",
    "SIMBIOCHEM II",
    "NeurIPS 2026 workshop",
    "NeurIPS workshops",
    "NeurIPS 2026 Sydney",
    "scientific workshop",
    "machine learning for molecular simulation",
    "ML for chemistry",
    "ML for biology",
    "molecular dynamics",
    "machine-learned interatomic potentials",
    "MLIPs",
    "learned potentials",
    "differentiable simulation",
    "molecular foundation models",
    "conformational ensembles",
    "free energy estimation",
    "protein folding",
    "computational chemistry",
    "computational biology",
    "biophysics",
    "agentic AI for science",
    "AI for science",
    "call for papers",
  ],
  openGraph: {
    // Kept short enough to survive the tightest unfurl (Slack/X) intact.
    title: "SIMBIOCHEM II · NeurIPS 2026 Workshop · Sydney",
    description:
      "Machine learning for simulations in biology and chemistry. Call for papers open — deadline August 29, 2026.",
    url: SITE_URL,
    siteName: "SIMBIOCHEM",
    locale: "en_AU",
    type: "website",
    // og:image comes from app/opengraph-image.tsx — do not also set it here.
  },
  twitter: {
    card: "summary_large_image",
    title: "SIMBIOCHEM II · NeurIPS 2026 Workshop · Sydney",
    description:
      "Machine learning for simulations in biology and chemistry. NeurIPS 2026, Sydney.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#001965",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full">
        {/* schema.org graph: Organization + WebSite + both workshop editions. */}
        <script
          type="application/ld+json"
          // Values are our own constants, not user input.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData(SITE_URL)),
          }}
        />
        <MotionProvider>{children}</MotionProvider>
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
