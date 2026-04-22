import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";

import "./globals.css";

import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", display.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-foreground)] antialiased">
        <TooltipProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
