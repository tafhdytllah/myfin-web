import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import "./globals.css";

import { Providers } from "@/app/providers";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyFin Web",
  description: "Personal finance dashboard for tracking income and expenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-foreground)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
