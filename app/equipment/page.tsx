"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EquipmentList } from "@/components/equipment-list"
import { EquipmentOnboarding } from "@/components/equipment-onboarding"

export default function EquipmentPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment</h1>
          <p className="text-muted-foreground">Manage and monitor your equipment fleet</p>
        </div>
        <Button onClick={() => setShowOnboarding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <EquipmentList />

      {showOnboarding && (
        <EquipmentOnboarding
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  )
}
