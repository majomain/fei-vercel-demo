"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import { ThemeProvider } from "./theme-provider"
import { EnergyRatesProvider } from "@/contexts/energy-rates-context"

interface ProvidersProps {
  children: React.ReactNode
  session?: Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
        storageKey="arkim-theme"
      >
        <EnergyRatesProvider>
          {children}
        </EnergyRatesProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
