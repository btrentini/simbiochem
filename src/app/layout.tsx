import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMBIOCHEM | NeurIPS 2026 Workshop",
  description:
    "SIMBIOCHEM: simulation at the boundary of biology and chemistry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
