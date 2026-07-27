import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { site } from "@/content/site";

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
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
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
