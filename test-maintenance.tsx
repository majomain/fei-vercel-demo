"use client"
import { MaintenanceSchedule } from "@/components/maintenance-schedule"

export function TestMaintenance() {
  return (
    <div className="p-4">
      <h2>Maintenance Scheduler Test</h2>
      <MaintenanceSchedule />

      <div className="mt-4 text-sm text-gray-600">
        If this shows a working scheduler, the issue is in the page integration. If it shows errors, the
        MaintenanceSchedule component needs fixing.
      </div>
    </div>
  )
}
