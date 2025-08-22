import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alerts | Arkim Dashboard",
  description: "Alert management for equipment monitoring",
}

export default function AlertsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
