import type { Metadata } from "next";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diet Buddy - Your Local-First Diet Tracker",
  description:
    "A modern, minimalist diet tracking app with glassmorphism design and full dark mode support.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientThemeProvider>
          <Navigation />
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
