"use client"

import { useState } from "react"
import { Building2, Store, Users, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface Company {
  id: string
  name: string
  type: "facility" | "store" | "warehouse"
  status: "active" | "inactive" | "maintenance"
  location: string
  equipmentCount: number
  initials: string
  color: string
}

interface CompanySelectorProps {
  currentCompany: Company
  companies: Company[]
  onCompanyChange: (companyId: string) => void
  onViewAllCompanies?: () => void
}

export function CompanySelector({
  currentCompany,
  companies,
  onCompanyChange,
  onViewAllCompanies
}: CompanySelectorProps) {
  // Defensive programming - ensure we have valid data
  if (!currentCompany || !companies || companies.length === 0) {
    console.warn("CompanySelector: Missing required props", { currentCompany, companies })
    return (
      <div className="h-9 px-3 flex items-center gap-2 text-muted-foreground">
        <span className="text-sm">No company selected</span>
      </div>
    )
  }
  const [isOpen, setIsOpen] = useState(false)

  const handleCompanySelect = (companyId: string) => {
    try {
      onCompanyChange(companyId)
      setIsOpen(false)
    } catch (error) {
      console.error("Error changing company:", error)
      setIsOpen(false)
    }
  }

  const getCompanyIcon = (type: Company["type"]) => {
    switch (type) {
      case "facility":
        return <Building2 className="h-4 w-4" />
      case "store":
        return <Store className="h-4 w-4" />
      case "warehouse":
        return <Building2 className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-3 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
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
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium leading-none">{currentCompany.name}</span>
              <span className="text-xs text-muted-foreground leading-none">
                {currentCompany.type} • {currentCompany.location}
              </span>
            </div>
            <div className="sm:hidden">
              <span className="text-sm font-medium">{currentCompany.name}</span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="start">
        {/* Current Company */}
        <DropdownMenuItem 
          className="flex items-center gap-3 p-3 cursor-default"
          onClick={(e: React.MouseEvent) => e.preventDefault()}
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback 
                className="text-sm font-medium text-white"
                style={{ backgroundColor: currentCompany.color }}
              >
                {currentCompany.initials}
              </AvatarFallback>
            </Avatar>
            <div 
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                getStatusColor(currentCompany.status)
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">{currentCompany.name}</p>
                <p className="text-xs text-muted-foreground leading-none truncate">
                  {currentCompany.type} • {currentCompany.location}
                </p>
              </div>
              <Check className="h-4 w-4 text-primary shrink-0" />
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />



        {/* Other Companies */}
        {companies
          .filter(company => company.id !== currentCompany.id)
          .slice(0, 3) // Show only first 3 other companies
          .map((company) => (
            <DropdownMenuItem
              key={company.id}
              className="flex items-center gap-3 p-3"
              onClick={() => handleCompanySelect(company.id)}
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback 
                    className="text-sm font-medium text-white"
                    style={{ backgroundColor: company.color }}
                  >
                    {company.initials}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                    getStatusColor(company.status)
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">{company.name}</p>
                <p className="text-xs text-muted-foreground leading-none truncate">
                  {company.type} • {company.location}
                </p>
              </div>
            </DropdownMenuItem>
          ))}



        {/* All Companies */}
        {onViewAllCompanies && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-3 p-3"
              onClick={() => {
                try {
                  onViewAllCompanies()
                  setIsOpen(false)
                } catch (error) {
                  console.error("Error viewing all companies:", error)
                  setIsOpen(false)
                }
              }}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted">
                <Store className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm">All companies</span>
            </DropdownMenuItem>
          </>
        )}


      </DropdownMenuContent>
    </DropdownMenu>
  )
}
