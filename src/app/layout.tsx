import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { site } from "@/content/site";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VWS9V4TY11";
const SITE_URL = process.env.SITE_URL ?? site.website;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SIMBIOCHEM II · Machine Learning for Simulations in Biology and Chemistry",
    template: "%s · SIMBIOCHEM II",
  },
  description:
    "The 2nd SIMBIOCHEM Workshop at NeurIPS 2026, Sydney — fusing molecular simulation, generative models and agentic AI into physics-aligned systems for biology and chemistry.",
  keywords: [
    "SIMBIOCHEM",
    "NeurIPS 2026",
    "machine learning",
    "molecular dynamics",
    "molecular simulation",
    "learned potentials",
    "agentic AI",
    "computational chemistry",
    "biophysics",
  ],
  openGraph: {
    title: "SIMBIOCHEM II · NeurIPS 2026, Sydney",
    description:
      "Machine Learning for Simulations in Biology and Chemistry. Call for papers open — deadline August 29, 2026.",
    url: SITE_URL,
    siteName: "SIMBIOCHEM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIMBIOCHEM II · NeurIPS 2026, Sydney",
    description:
      "Machine Learning for Simulations in Biology and Chemistry. Call for papers open.",
  },
};

export const viewport: Viewport = {
  themeColor: "#001965",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout applies globally */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">
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
