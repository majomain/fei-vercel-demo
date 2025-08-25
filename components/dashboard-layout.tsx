"use client"

import type React from "react"
import { useState, useMemo, Suspense, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, Wrench, Box, Database, Plus, LogOut, Activity } from "lucide-react"
import { NotificationsDropdown } from "./notifications-dropdown"
import { ThemeToggle } from "./theme-toggle"
// import { useCompany } from "@/contexts/company-context"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
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
import { ScrollToTop } from "./scroll-to-top"
import { useRouter, usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  onAddEquipment?: () => void
}

function DashboardLayoutContent({ children, onAddEquipment }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  // const { currentCompany, companies, setCurrentCompany } = useCompany()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Restore scroll position when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      // Reset scroll position for new pages
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0)
      }
    }

    handleRouteChange()
  }, [pathname])

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "overview":
        router.push("/")
        break
      case "equipment":
        router.push("/equipment")
        break
      case "maintenance":
        router.push("/maintenance")
        break
      case "monitoring":
        router.push("/monitoring")
        break
      case "data-logs":
        router.push("/data-logs")
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

  const handleLogout = () => {
    try {
      // Add actual logout logic here when ready
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const navigationItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      id: "equipment",
      label: "Equipment",
      icon: Box,
      path: "/equipment",
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
      path: "/data-logs",
    },
  ]

  const activeItem = useMemo(() => {
    if (pathname === "/maintenance") return "maintenance"
    if (pathname === "/monitoring") return "monitoring"
    if (pathname === "/equipment") return "equipment"
    if (pathname === "/data-logs") return "data-logs"
    if (pathname === "/") return "overview"
    return "overview"
  }, [pathname])

  return (
    <div className="min-h-screen w-full dashboard-layout">
      {/* Full-width header at the top */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background z-20 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center hover:opacity-80 transition-opacity p-2"
          >
            <Image
              src="/logo-blk-wht-01@4x.png"
              alt="Home"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg"
            />
          </button>
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
              <DropdownMenuItem className="dropdown-menu-item" onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="dropdown-menu-item" onClick={handleLogout}>
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
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        <SidebarProvider>
          <Sidebar className="shrink-0 border-r bg-muted/30">
            <SidebarContent className="pt-6 px-3">
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
          
          {/* Mobile sidebar trigger */}
          <SidebarTrigger className="fixed top-20 left-4 z-30 lg:hidden" />

          {/* Main content area - fixed for proper scrolling */}
          <div className="flex-1 min-w-0">
            <main className="min-h-full overflow-y-auto overflow-x-hidden">
              <div className="p-6 pb-12 w-full max-w-none">{children}</div>
            </main>
          </div>
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
      
      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  )
}

export default function DashboardLayout({ children, onAddEquipment }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  // Don't render dashboard layout for settings pages - they have their own layout
  if (pathname.startsWith('/settings')) {
    return <>{children}</>
  }

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

// Also export as named export for compatibility
export { DashboardLayout }
