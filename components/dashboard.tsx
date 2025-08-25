"use client"

import { EquipmentStatus } from "./equipment-status"
import { EnergyUsageSummary } from "./energy-usage-summary"
import { SensorInsights } from "./sensor-insights"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Equipment Status - Now expanded to full width */}
      <div className="xl:grid xl:grid-cols-1 xl:gap-6">
        <EquipmentStatus />
      </div>

      {/* Energy Usage Analysis */}
      <EnergyUsageSummary />

      {/* Sensor Insights */}
      <SensorInsights />
    </div>
  )
}
