"use client"

import type React from "react"
import { useState, useMemo, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, Wrench, Box, Database, Plus, LogOut, Activity, Grid3X3, User } from "lucide-react"
import { NotificationsDropdown } from "./notifications-dropdown"
import { ThemeToggle } from "./theme-toggle"
import { CompanySelector } from "./company-selector"
import { SimpleCompanyDisplay } from "./simple-company-display"
// import { useCompany } from "@/contexts/company-context"
import { ArkimLogo } from "./arkim-logo"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EquipmentOnboarding } from "./equipment-onboarding"
import { UserProfileModal } from "./user-profile-modal"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  onAddEquipment?: () => void
}

function DashboardLayoutContent({ children, onAddEquipment }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // const { currentCompany, companies, setCurrentCompany } = useCompany()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "overview":
        router.push("/")
        break
      case "equipment":
        router.push("/?tab=equipment")
        break
      case "maintenance":
        router.push("/maintenance")
        break
      case "monitoring":
        router.push("/monitoring")
        break


      case "data-logs":
        router.push("/?tab=data-logs")
        break
      default:
        break
    }
  }

  const handleAddEquipment = () => {
    if (onAddEquipment) {
      onAddEquipment()
    } else {
      setShowOnboarding(true)
    }
  }

  const handleViewAllCompanies = () => {
    router.push("/settings/locations")
  }

  const handleLogout = () => {
    try {
      console.log("[v0] Logout clicked")
      // Add actual logout logic here when ready
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      id: "equipment",
      label: "Equipment",
      icon: Box,
      path: "/?tab=equipment",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Wrench,
      path: "/maintenance",
    },
    {
      id: "monitoring",
      label: "Monitoring",
      icon: Activity,
      path: "/monitoring",
    },


    {
      id: "data-logs",
      label: "Data Logs",
      icon: Database,
      path: "/?tab=data-logs",
    },

  ]

  const activeItem = useMemo(() => {
    if (pathname === "/maintenance") return "maintenance"
    if (pathname === "/monitoring") return "monitoring"
    if (pathname === "/") {
      const tab = searchParams.get("tab")
      if (tab === "equipment") return "equipment"
      if (tab === "data-logs") return "data-logs"
      return "overview"
    }
    return "overview"
  }, [pathname, searchParams])

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Full-width header at the top */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <ArkimLogo className="h-8 w-8 text-primary" />
          <h1 className="text-lg font-semibold truncate">Arkim Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleAddEquipment}
            variant="outline"
            size="sm"
            className="hidden sm:flex bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
          <Button onClick={handleAddEquipment} variant="outline" size="sm" className="sm:hidden bg-transparent">
            <Plus className="h-4 w-4" />
          </Button>

          <NotificationsDropdown />
          <ThemeToggle />
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  console.log("[v0] Settings dropdown trigger clicked")
                  setDropdownOpen(!dropdownOpen)
                }}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Temporarily disabled CompanySelector
          <CompanySelector
            // currentCompany={currentCompany}
            // companies={companies}
            // onCompanyChange={setCurrentCompany}
            onViewAllCompanies={handleViewAllCompanies}
          />
          */}
        </div>
      </header>

      {/* Content area with sidebar and main content */}
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <SidebarProvider>
          <Sidebar className="shrink-0">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.id)}
                      isActive={activeItem === item.id}
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
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="p-4 pb-8">{children}</div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {showOnboarding && (
        <EquipmentOnboarding
          onClose={() => setShowOnboarding(false)}
          onEquipmentAdded={() => {
            setShowOnboarding(false)
          }}
        />
      )}
      {showUserProfile && <UserProfileModal open={showUserProfile} onOpenChange={setShowUserProfile} />}
    </div>
  )
}

export function DashboardLayout({ children, onAddEquipment }: DashboardLayoutProps) {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardLayoutContent onAddEquipment={onAddEquipment}>
        {children}
      </DashboardLayoutContent>
    </Suspense>
  )
}
