import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Landscape — SE Edition",
  description:
    "Daily-refreshed directory of AI tools curated for Software Engineers. Browse 500+ tools across 8 categories, updated every day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
