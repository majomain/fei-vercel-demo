import type React from "react"
import type { Metadata } from "next"
import { SettingsLayout } from "@/components/settings-layout"

export const metadata: Metadata = {
  title: "Settings | Industrial Dashboard",
  description: "Manage your dashboard settings",
}

export default function SettingsLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SettingsLayout>{children}</SettingsLayout>
}
