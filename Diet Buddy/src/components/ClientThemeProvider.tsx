"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ClientThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
