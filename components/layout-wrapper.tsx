"use client"

import DashboardLayout from "./dashboard-layout"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return <DashboardLayout>{children}</DashboardLayout>
}
