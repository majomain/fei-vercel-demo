"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Settings,
  User,
  Wrench,
  Database,
  TrendingUp,
  AlertTriangle,
  FileText,
  Plus,
  Activity,
  Users,
} from "lucide-react"
import { EquipmentList } from "./equipment-list"
import { NotificationsDropdown } from "./notifications-dropdown"
import { ThemeToggle } from "./theme-toggle"
import { generateReport } from "@/lib/generate-report"
import { EquipmentStatus } from "./equipment-status"
import { EquipmentCycleTracking } from "./equipment-cycle-tracking"
import { SensorInsights } from "./sensor-insights"
import { EquipmentHealthScore } from "./equipment-health-score"
import { EquipmentOnboarding } from "./equipment-onboarding"
import { DataLogs } from "./data-logs"
import { EnergyUsageSummary } from "./energy-usage-summary"
import { useRouter, useSearchParams } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [liveSensorData, setLiveSensorData] = useState([])
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(undefined)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [sharedMaintenanceEvents, setSharedMaintenanceEvents] = useState([])

  // Get the active tab from URL parameters
  const activeTab = searchParams.get("tab") || "overview"

  const handleMaintenanceEventUpdate = useCallback((updatedEvents: any) => {
    setSharedMaintenanceEvents(updatedEvents)
  }, [])

  const handleEquipmentSelect = useCallback((equipmentId: any) => {
    setSelectedEquipmentId(equipmentId)
  }, [])

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "equipment-performance":
        alert("Generating Equipment Performance Report...")
        break
      case "trend-data":
        alert("Generating Trend Data Report...")
        break
      case "maintenance-activity":
        alert("Generating Maintenance Activity Report...")
        break
      case "alerts-incidents":
        alert("Generating Alerts & Incidents Report...")
        break
      case "executive-summary":
        alert("Generating Executive Summary Report...")
        break
      case "generate-report":
        generateReport()
        break
      case "schedule-maintenance":
        // Handle schedule maintenance
        break
      case "add-equipment":
        // Handle add equipment
        break
      default:
        break
    }
  }

  const handleNavigation = (itemId: string) => {
    if (itemId === "maintenance") {
      router.push("/maintenance")
    } else if (itemId === "monitoring") {
      router.push("/monitoring")
    } else if (itemId === "users") {
      router.push("/users")
    } else {
      router.push(`/?tab=${itemId}`)
    }
  }

  return (
    <div className="space-y-4">
      {activeTab === "overview" && (
        <div className="space-y-6 min-h-0">
          {/* Overview Page Title */}
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground">
                  Comprehensive view of your equipment performance and system status
                </p>
              </div>
            </div>
          </div>

          {/* Equipment Health Score - Full Width */}
          <div className="w-full">
            <EquipmentHealthScore
              sharedMaintenanceEvents={sharedMaintenanceEvents}
              onMaintenanceEventUpdate={handleMaintenanceEventUpdate}
              liveSensorData={liveSensorData}
            />
          </div>

          {/* Sensor Insights - Full Width */}
          <div className="w-full">
            <SensorInsights selectedEquipmentId={selectedEquipmentId} />
          </div>

          {/* Energy Usage Summary - Full Width */}
          <div className="w-full">
            <EnergyUsageSummary />
          </div>

          {/* Equipment Status and Cycle Tracking - Responsive Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="w-full">
              <EquipmentStatus />
            </div>
            <div className="w-full">
              <EquipmentCycleTracking />
            </div>
          </div>
        </div>
      )}

      {activeTab === "monitoring" && (
        <div className="space-y-6 min-h-0">
          {/* Equipment Health Score - Full Width */}
          <div className="w-full">
            <EquipmentHealthScore
              sharedMaintenanceEvents={sharedMaintenanceEvents}
              onMaintenanceEventUpdate={handleMaintenanceEventUpdate}
              liveSensorData={liveSensorData}
            />
          </div>

          {/* Sensor Insights - Full Width */}
          <div className="w-full">
            <SensorInsights selectedEquipmentId={selectedEquipmentId} />
          </div>

          {/* Energy Usage Summary - Full Width */}
          <div className="w-full">
            <EnergyUsageSummary />
          </div>

          {/* Equipment Status and Cycle Tracking - Responsive Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="w-full">
              <EquipmentStatus />
            </div>
            <div className="w-full">
              <EquipmentCycleTracking />
            </div>
          </div>
        </div>
      )}

      {activeTab === "equipment" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Equipment Management</h2>
            <Button onClick={() => setShowOnboarding(true)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </div>
          <EquipmentList onEquipmentSelect={handleEquipmentSelect} />
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Maintenance Schedule</h2>
            <Button onClick={() => setShowOnboarding(true)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No upcoming maintenance scheduled
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No recent maintenance records
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View complete maintenance history
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "data-logs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Data Logs</h2>
            <Button onClick={() => setShowOnboarding(true)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          <DataLogs />
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Placeholder for Users section */}
          <div className="w-full">
            <p className="text-lg font-semibold">Users Section</p>
          </div>
        </div>
      )}

      {activeTab === "generate-report" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generate Report</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Report Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Custom range</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Equipment Filter</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Equipment</option>
                    <option>Production Line A</option>
                    <option>Production Line B</option>
                    <option>Utilities</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Equipment Performance Report</div>
                    <div className="text-sm text-muted-foreground">Generated on Dec 15, 2024</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Maintenance Activity Summary</div>
                    <div className="text-sm text-muted-foreground">Generated on Dec 12, 2024</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Executive Summary Q4</div>
                    <div className="text-sm text-muted-foreground">Generated on Dec 10, 2024</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showOnboarding && (
        <EquipmentOnboarding
          onClose={() => setShowOnboarding(false)}
          onEquipmentAdded={(equipmentId: any) => {
            setSelectedEquipmentId(equipmentId)
            setShowOnboarding(false)
          }}
        />
      )}
    </div>
  )
}

// Make the Dashboard component available as a named export
export { Dashboard }
