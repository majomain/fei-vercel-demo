"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useClientOnly } from "@/hooks/use-client-only"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const isClient = useClientOnly()

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!isClient) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
