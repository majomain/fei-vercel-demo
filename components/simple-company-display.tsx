"use client"

import { Company } from "./company-selector"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface SimpleCompanyDisplayProps {
  currentCompany: Company
}

export function SimpleCompanyDisplay({ currentCompany }: SimpleCompanyDisplayProps) {
  const getStatusColor = (status: Company["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-400"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg">
      <div className="relative">
        <Avatar className="h-6 w-6">
          <AvatarFallback 
            className="text-xs font-medium text-white"
            style={{ backgroundColor: currentCompany.color }}
          >
            {currentCompany.initials}
          </AvatarFallback>
        </Avatar>
        <div 
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
            getStatusColor(currentCompany.status)
          )}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{currentCompany.name}</span>
        <span className="text-xs text-muted-foreground">
          {currentCompany.type} • {currentCompany.location}
        </span>
      </div>
    </div>
  )
}
