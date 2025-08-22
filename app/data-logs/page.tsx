"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataLogs } from "@/components/data-logs"

export default function DataLogsPage() {
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Logs</h1>
          <p className="text-muted-foreground">Real-time sensor data and IoT device logs</p>
        </div>
        <Button onClick={() => setShowExportModal(true)} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <DataLogs />

      {/* TODO: Add export modal component */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Export Data</h3>
            <p className="text-muted-foreground mb-4">
              Export functionality coming soon...
            </p>
            <Button onClick={() => setShowExportModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
