export interface Equipment {
  id: string
  name: string
  model: string
  serialNumber: string
  location: string
  type?: string // Equipment type for energy calculations
  manufacturer: string
  installDate: Date
  status: "operational" | "warning" | "critical" | "maintenance"
  lastMaintenance: Date
  nextMaintenance: Date
  sensors: {
    id: string
    type: string
    status: "active" | "warning" | "disconnected"
    currentReading?: number
    unit?: string
  }[]
  uptime: number
  energyConsumption: number
  assignedStaff: string
  serviceProviderContact: string
  runTime?: number // Runtime in seconds
  cycles?: {
    last24h: number
    last7d: number
    last30d: number
  }
  cyclesTrend?: number // Percentage change in cycling
}
