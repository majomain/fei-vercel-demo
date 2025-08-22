"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Settings, MapPin, Users, Key, User, ArrowLeft, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Suspense } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface SettingsLayoutProps {
  children: React.ReactNode
}

function SettingsLayoutContent({ children }: SettingsLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  // const { currentCompany, companies, setCurrentCompany } = useCompany()

  const navigationItems = [
    {
      id: "general",
      label: "General",
      icon: Settings,
      path: "/settings",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/settings/profile",
    },
    {
      id: "locations",
      label: "Locations",
      icon: MapPin,
      path: "/settings/locations",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/settings/users",
    },
    {
      id: "api-keys",
      label: "API Keys",
      icon: Key,
      path: "/settings/api-keys",
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const getActiveItem = () => {
    if (pathname === "/settings") return "general"
    if (pathname === "/settings/profile") return "profile"
    if (pathname === "/settings/locations") return "locations"
    if (pathname === "/settings/users") return "users"
    if (pathname === "/settings/api-keys") return "api-keys"
    return "general"
  }

  return (
    <div className="h-screen w-screen flex settings-layout">
      <SidebarProvider>
        <div className="flex h-full w-full">
          <Sidebar className="shrink-0">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="font-semibold">Settings</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
                      isActive={getActiveItem() === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="flex-1 min-w-0">
            <div className="flex h-full flex-col">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Button onClick={() => router.push("/")} variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h1 className="text-lg font-semibold truncate">Settings</h1>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/")}
                    className="h-8 w-8 p-0"
                    title="Close settings and return to dashboard"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-4">{children}</div>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    }>
      <SettingsLayoutContent>
        {children}
      </SettingsLayoutContent>
    </Suspense>
  )
}
