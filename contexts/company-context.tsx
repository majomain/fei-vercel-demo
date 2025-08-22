"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Company } from "@/components/company-selector"

interface CompanyContextType {
  currentCompany: Company
  companies: Company[]
  setCurrentCompany: (companyId: string) => void
  addCompany: (company: Company) => void
  updateCompany: (companyId: string, updates: Partial<Company>) => void
  removeCompany: (companyId: string) => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

// Mock data - in a real app, this would come from an API
const defaultCompanies: Company[] = [
  {
    id: "1",
    name: "Bar-WeHo",
    type: "store",
    status: "active",
    location: "Hollywood",
    equipmentCount: 12,
    initials: "BH",
    color: "#10b981", // emerald-500
  },
  {
    id: "2",
    name: "Restaurant-NYC",
    type: "facility",
    status: "active",
    location: "Industrial Zone",
    equipmentCount: 45,
    initials: "RN",
    color: "#3b82f6", // blue-500
  },
  {
    id: "3",
    name: "Warehouse Distribution Center",
    type: "warehouse",
    status: "active",
    location: "Logistics Park",
    equipmentCount: 28,
    initials: "WD",
    color: "#f59e0b", // amber-500
  },
  {
    id: "4",
    name: "Quality Control Lab",
    type: "facility",
    status: "maintenance",
    location: "Research Campus",
    equipmentCount: 15,
    initials: "QC",
    color: "#8b5cf6", // violet-500
  },
  {
    id: "5",
    name: "Secondary Retail Location",
    type: "store",
    status: "active",
    location: "Shopping Center",
    equipmentCount: 8,
    initials: "SR",
    color: "#ef4444", // red-500
  },
]

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(defaultCompanies)
  const [currentCompany, setCurrentCompanyState] = useState<Company>(defaultCompanies[0])
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load current company from localStorage on mount (only on client)
  useEffect(() => {
    if (!isClient) return
    
    try {
      const savedCompanyId = localStorage.getItem("currentCompanyId")
      if (savedCompanyId) {
        const savedCompany = defaultCompanies.find(c => c.id === savedCompanyId)
        if (savedCompany) {
          setCurrentCompanyState(savedCompany)
        }
      }
    } catch (error) {
      console.error("Error loading company from localStorage:", error)
    }
  }, [isClient]) // Only run when isClient changes

  const setCurrentCompany = (companyId: string) => {
    try {
      const company = companies.find(c => c.id === companyId)
      if (company) {
        setCurrentCompanyState(company)
        if (isClient) {
          try {
            localStorage.setItem("currentCompanyId", companyId)
          } catch (error) {
            console.error("Error saving company to localStorage:", error)
          }
        }
      } else {
        console.error("Company not found:", companyId)
      }
    } catch (error) {
      console.error("Error setting current company:", error)
    }
  }

  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company])
  }

  const updateCompany = (companyId: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => 
      c.id === companyId ? { ...c, ...updates } : c
    ))
    
    // Update current company if it's the one being updated
    if (currentCompany.id === companyId) {
      setCurrentCompanyState(prev => ({ ...prev, ...updates }))
    }
  }

  const removeCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId))
    
    // If current company is removed, switch to first available company
    if (currentCompany.id === companyId && companies.length > 1) {
      const remainingCompanies = companies.filter(c => c.id !== companyId)
      setCurrentCompanyState(remainingCompanies[0])
      localStorage.setItem("currentCompanyId", remainingCompanies[0].id)
    }
  }

  const value: CompanyContextType = {
    currentCompany,
    companies,
    setCurrentCompany,
    addCompany,
    updateCompany,
    removeCompany,
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider")
  }
  return context
}
