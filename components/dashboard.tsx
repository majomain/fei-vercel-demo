"use client"

import { useState, useCallback } from "react"

import { EquipmentStatus } from "./equipment-status"
import { EquipmentCycleTracking } from "./equipment-cycle-tracking"
import { SensorInsights } from "./sensor-insights"
import { EnergyUsageSummary } from "./energy-usage-summary"


export default function Dashboard() {
  const [liveSensorData, setLiveSensorData] = useState([])
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(undefined)
  const [sharedMaintenanceEvents, setSharedMaintenanceEvents] = useState([])

  const handleMaintenanceEventUpdate = useCallback((updatedEvents: any) => {
    setSharedMaintenanceEvents(updatedEvents)
  }, [])

  const handleEquipmentSelect = useCallback((equipmentId: any) => {
    setSelectedEquipmentId(equipmentId)
  }, [])

    return (
    <div className="space-y-6">
      <div className="space-y-6 min-h-0 mb-16">
        {/* Dashboard Page Title */}
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive view of your equipment performance and system status
              </p>
            </div>
          </div>
        </div>

        {/* Equipment Status and Cycle Tracking - Moved to top */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="w-full">
            <EquipmentStatus />
          </div>
          <div className="w-full">
            <EquipmentCycleTracking />
          </div>
        </div>

        {/* Sensor Insights - Full Width */}
        <div className="w-full">
          <SensorInsights selectedEquipmentId={selectedEquipmentId} />
        </div>

        {/* Energy Usage Summary - Full Width */}
        <div className="w-full">
          <EnergyUsageSummary />
        </div>
      </div>
    </div>
  )
}

// Make the Dashboard component available as a named export
export { Dashboard }
