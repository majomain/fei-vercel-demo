"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts"
import { Zap, Calendar } from "lucide-react"
import { equipmentData } from "./equipment-list"

interface EnergyDataPoint {
  period: string
  currentMonth: number
  previousMonth?: number
  rateTier?: 'on-peak' | 'mid-peak' | 'off-peak' | 'super-off-peak'
  currentMonthDollars?: number
  previousMonthDollars?: number
}

interface AssetCost {
  id: string
  name: string
  usage: number
  cost: number
  rate: number
}

export function EnergyUsageSummary() {
  const [selectedAsset, setSelectedAsset] = useState("all")
  const [granularity, setGranularity] = useState<"24hours" | "daily" | "monthly">("24hours")
  const [showPreviousMonth, setShowPreviousMonth] = useState(false)
  const [displayMode, setDisplayMode] = useState<"kWh" | "dollars">("kWh")
  const [energyData, setEnergyData] = useState<EnergyDataPoint[]>([])
  const [assetCosts, setAssetCosts] = useState<AssetCost[]>([])

  // Energy rates per kWh for different equipment types
  const energyRates = {
    "Refrigeration Unit": 0.12,
    "HVAC System": 0.1,
    Compressor: 0.15,
    "Conveyor Belt": 0.08,
    "Packaging Machine": 0.11,
  }

  // Generate energy usage data based on granularity
  useEffect(() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const currentHour = today.getHours()
    
    let data: EnergyDataPoint[] = []
    
    if (granularity === "24hours") {
      // Full 24-hour view for current day
      const today = new Date()
      const isSummer = today.getMonth() >= 5 && today.getMonth() <= 8 // Jun-Sep
      
      for (let hour = 0; hour < 24; hour++) {
        const baseUsage = selectedAsset === "all" 
          ? equipmentData.reduce((sum, eq) => sum + (2 + Math.random() * 1.5), 0)
          : 2 + Math.random() * 1.5
        
        // Only show data for hours that have passed, leave future hours blank
        const isPastHour = hour <= currentHour
        
        const hourlyUsage = baseUsage + Math.sin(hour / 6) * 0.5 + (Math.random() * 1 - 0.5)
        const previousDayUsage = baseUsage + Math.sin(hour / 6) * 0.4 + (Math.random() * 0.8 - 0.4)
        
        // Determine SCE TOU rate tier for this hour
        let rateTier: 'on-peak' | 'mid-peak' | 'off-peak' | 'super-off-peak' = 'off-peak'
        
        if (hour >= 16 && hour < 21) { // 4:00 PM to 8:59 PM
          if (isSummer) {
            rateTier = 'on-peak'
          } else {
            rateTier = 'mid-peak'
          }
        } else if (hour >= 8 && hour < 16) { // 8:00 AM to 3:59 PM
          if (!isSummer) {
            rateTier = 'super-off-peak'
          }
        }
        // All other hours default to off-peak
        
        data.push({
          period: `${hour.toString().padStart(2, '0')}:00`,
          currentMonth: isPastHour ? Math.max(0, hourlyUsage) : 0,
          previousMonth: showPreviousMonth ? Math.max(0, previousDayUsage) : 0, // Always populate previous day data
          rateTier: isPastHour ? rateTier : undefined,
          currentMonthDollars: isPastHour ? Math.max(0, hourlyUsage) * 0.057 : 0,
          previousMonthDollars: showPreviousMonth ? Math.max(0, previousDayUsage) * 0.057 : 0
        })
      }
    } else if (granularity === "daily") {
      // Daily data for current month
      const currentMonthNum = today.getMonth()
      const currentYearNum = today.getFullYear()
      const daysInMonth = new Date(currentYearNum, currentMonthNum + 1, 0).getDate()
      const currentDay = today.getDate()
      
      for (let day = 1; day <= daysInMonth; day++) {
        const baseUsage = selectedAsset === "all" 
          ? equipmentData.reduce((sum, eq) => sum + (50 + Math.random() * 30), 0)
          : 50 + Math.random() * 30
        
        const dailyUsage = baseUsage + Math.sin(day / 15) * 10 + (Math.random() * 20 - 10)
        const previousMonthUsage = baseUsage + Math.sin(day / 15) * 8 + (Math.random() * 16 - 8)
        
        // Only show data for days that have passed, leave future days blank
        const isPastDay = day <= currentDay
        
        data.push({
          period: day.toString(),
          currentMonth: isPastDay ? Math.max(0, dailyUsage) : 0,
          previousMonth: showPreviousMonth ? Math.max(0, previousMonthUsage) : 0, // Always populate previous month data
          currentMonthDollars: isPastDay ? Math.max(0, dailyUsage) * 0.057 : 0,
          previousMonthDollars: showPreviousMonth ? Math.max(0, previousMonthUsage) * 0.057 : 0
        })
      }
    } else {
      // Monthly data for current year - show all 12 months
      for (let month = 0; month < 12; month++) {
        const baseUsage = selectedAsset === "all" 
          ? equipmentData.reduce((sum, eq) => sum + (1500 + Math.random() * 900), 0)
          : 1500 + Math.random() * 900
        
        const isPastMonth = month <= today.getMonth()
        const monthlyUsage = isPastMonth ? baseUsage + Math.sin(month / 3) * 300 + (Math.random() * 600 - 300) : 0
        const previousYearUsage = baseUsage + Math.sin(month / 3) * 240 + (Math.random() * 450 - 225)
        
        data.push({
          period: new Date(currentYear, month).toLocaleDateString('en-US', { month: 'short' }),
          currentMonth: Math.max(0, monthlyUsage),
          previousMonth: showPreviousMonth ? Math.max(0, previousYearUsage) : 0, // Always populate previous year data
          currentMonthDollars: Math.max(0, monthlyUsage) * 0.057,
          previousMonthDollars: showPreviousMonth ? Math.max(0, previousYearUsage) * 0.057 : 0
        })
      }
    }
    
    setEnergyData(data)
  }, [selectedAsset, granularity, showPreviousMonth])

  // Calculate asset costs
  useEffect(() => {
    const costs: AssetCost[] = equipmentData.map((equipment) => {
      let usage: number
      let cost: number
      
      if (granularity === "24hours") {
        // Daily usage for hourly view
        usage = 30 + Math.random() * 20 // kWh per day
        cost = usage * 0.057 // Daily cost
      } else if (granularity === "daily") {
        // Monthly usage for daily view
        usage = 800 + Math.random() * 400 // kWh per month
        cost = usage * 0.057 // Monthly cost
      } else {
        // Yearly usage for monthly view
        usage = 9600 + Math.random() * 4800 // kWh per year
        cost = usage * 0.057 // Yearly cost
      }
      
      const rate = energyRates[equipment.type as keyof typeof energyRates] || 0.11

      return {
        id: `equipment${equipment.id}`,
        name: equipment.name,
        usage: usage,
        cost: cost,
        rate,
      }
    })

    setAssetCosts(costs)
  }, [granularity, equipmentData])

  // Calculate totals for current month and percentage changes
  const totals = useMemo(() => {
    const totalUsage = energyData.reduce((sum, d) => sum + (d.currentMonth || 0), 0)
    const avgUsage = energyData.length > 0 ? totalUsage / energyData.length : 0
    
    // Calculate previous period totals for comparison
    const previousTotalUsage = energyData.reduce((sum, d) => sum + (d.previousMonth || 0), 0)
    const previousAvgUsage = energyData.length > 0 ? previousTotalUsage / energyData.length : 0
    
    // Calculate dollar totals
    const totalDollars = energyData.reduce((sum, d) => sum + (d.currentMonthDollars || 0), 0)
    const avgDollars = energyData.length > 0 ? totalDollars / energyData.length : 0
    const previousTotalDollars = energyData.reduce((sum, d) => sum + (d.previousMonthDollars || 0), 0)
    const previousAvgDollars = energyData.length > 0 ? previousTotalDollars / energyData.length : 0
    
    // Calculate percentage changes
    const totalUsageChange = previousTotalUsage > 0 
      ? ((totalUsage - previousTotalUsage) / previousTotalUsage) * 100 
      : 0
    
    const avgUsageChange = previousAvgUsage > 0 
      ? ((avgUsage - previousAvgUsage) / previousAvgUsage) * 100 
      : 0
    
    return {
      totalUsage,
      avgUsage,
      totalDollars,
      avgDollars,
      previousTotalUsage,
      previousAvgUsage,
      previousTotalDollars,
      previousAvgDollars,
      totalUsageChange,
      avgUsageChange,
      hasPreviousData: previousTotalUsage > 0
    }
  }, [energyData, showPreviousMonth])

  const CustomChartLegend = ({ payload }: any) => {
    return (
      <ul className="flex justify-center gap-x-4 mt-2">
        {payload.map((entry: any, index: number) => {
          const { value } = entry;
          
          if (granularity === "24hours") {
            // Hourly view - show date-specific legend with strokes
            if (value.includes("Current")) {
              // Today's data - black stroke
              const today = new Date()
              const dayName = today.toLocaleDateString('en-US', { weekday: 'short' })
              const day = today.getDate()
              const month = today.toLocaleDateString('en-US', { month: 'short' })
              const formattedDate = `${dayName} ${day} ${month}`
              
              return (
                <li key={`legend-${index}`} className="flex items-center text-sm text-muted-foreground">
                  <span
                    style={{
                      border: '2px solid black',
                      backgroundColor: 'transparent',
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }}
                  ></span>
                  {formattedDate}
                </li>
              );
            } else if (value.includes("Previous")) {
              // Previous day data - grey stroke
              const yesterday = new Date()
              yesterday.setDate(yesterday.getDate() - 1)
              const dayName = yesterday.toLocaleDateString('en-US', { weekday: 'short' })
              const day = yesterday.getDate()
              const month = yesterday.toLocaleDateString('en-US', { month: 'short' })
              const formattedDate = `${dayName} ${day} ${month}`
              
              return (
                <li key={`legend-${index}`} className="flex items-center text-sm text-muted-foreground">
                  <span
                    style={{
                      border: '2px solid hsl(var(--muted-foreground))',
                      backgroundColor: 'transparent',
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }}
                  ></span>
                  {formattedDate}
                </li>
              );
            }
          } else {
            // Daily and Monthly views - show generic period legend with fills
            if (value.includes("Current")) {
              return (
                <li key={`legend-${index}`} className="flex items-center text-sm text-muted-foreground">
                  <span
                    style={{
                      backgroundColor: 'black',
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }}
                  ></span>
                  {granularity === "daily" ? (() => {
                    const today = new Date()
                    return today.toLocaleDateString('en-US', { month: 'short' })
                  })() : granularity === "monthly" ? (() => {
                    const today = new Date()
                    return today.getFullYear().toString()
                  })() : "Current Period"}
                </li>
              );
            } else if (value.includes("Previous")) {
              return (
                <li key={`legend-${index}`} className="flex items-center text-sm text-muted-foreground">
                  <span
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }}
                  ></span>
                  {granularity === "daily" ? (() => {
                    const today = new Date()
                    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1)
                    return previousMonth.toLocaleDateString('en-US', { month: 'short' })
                  })() : granularity === "monthly" ? (() => {
                    const today = new Date()
                    return (today.getFullYear() - 1).toString()
                  })() : "Previous Period"}
                </li>
              );
            }
          }
          return null;
        })}
      </ul>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-semibold">{data.period}</p>
          {granularity === "24hours" && data.rateTier && (
            <p className="text-sm mb-2">
              Rate Tier: <span className="font-medium capitalize">{data.rateTier.replace('-', ' ')}</span>
            </p>
          )}
          {data.currentMonth > 0 && (
            <p className="text-sm text-muted-foreground">
              {granularity === "24hours" ? (
                <>
                  {(() => {
                    const today = new Date()
                    const dayName = today.toLocaleDateString('en-US', { weekday: 'short' })
                    const day = today.getDate()
                    const month = today.toLocaleDateString('en-US', { month: 'short' })
                    return `${dayName}, ${day} ${month}`
                  })()}: <span className="font-medium">
                    {displayMode === "kWh" ? `${data.currentMonth.toFixed(1)} kWh` : `$${data.currentMonthDollars?.toFixed(2)}`}
                  </span>
                </>
              ) : (
                <>
                  Current Period: <span className="font-medium">
                    {displayMode === "kWh" ? `${data.currentMonth.toFixed(1)} kWh` : `$${data.currentMonthDollars?.toFixed(2)}`}
                  </span>
                </>
              )}
            </p>
          )}
          {data.previousMonth && data.previousMonth > 0 && (
            <p className="text-sm text-muted-foreground">
              {granularity === "24hours" ? (
                <>
                  {(() => {
                    const yesterday = new Date()
                    yesterday.setDate(yesterday.getDate() - 1)
                    const dayName = yesterday.toLocaleDateString('en-US', { weekday: 'short' })
                    const day = yesterday.getDate()
                    const month = yesterday.toLocaleDateString('en-US', { month: 'short' })
                    return `${dayName}, ${day} ${month}`
                  })()}: <span className="font-medium">
                    {displayMode === "kWh" ? `${data.previousMonth.toFixed(1)} kWh` : `$${data.previousMonthDollars?.toFixed(2)}`}
                  </span>
                </>
              ) : (
                <>
                  Previous Period: <span className="font-medium">
                    {displayMode === "kWh" ? `${data.previousMonth.toFixed(1)} kWh` : `$${data.previousMonthDollars?.toFixed(2)}`}
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Energy Usage Analysis
            </CardTitle>
            <CardDescription>Real-time energy consumption data</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                {equipmentData.map((equipment) => (
                  <SelectItem key={equipment.id} value={`equipment${equipment.id}`}>
                    {equipment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={granularity} onValueChange={(value: "24hours" | "daily" | "monthly") => setGranularity(value)}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Granularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hours">Hour</SelectItem>
                <SelectItem value="daily">Day</SelectItem>
                <SelectItem value="monthly">Month</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Display Mode Toggle */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setDisplayMode("kWh")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  displayMode === "kWh"
                    ? "bg-foreground text-background"
                    : "text-foreground hover:text-muted-foreground"
                }`}
              >
                kWh
              </button>
              <button
                onClick={() => setDisplayMode("dollars")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  displayMode === "dollars"
                    ? "bg-foreground text-background"
                    : "text-foreground hover:text-muted-foreground"
                }`}
              >
                $
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-blue-600 font-medium">
                    {granularity === "24hours" ? "Hour Total Usage" :
                     granularity === "daily" ? "Day Total Usage" :
                     "Month Total Usage"}
                  </p>
                  {totals.hasPreviousData && (
                    <span 
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        totals.totalUsageChange <= 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-green-700'
                      }`}
                    >
                      {totals.totalUsageChange > 0 ? '+' : ''}{totals.totalUsageChange.toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold">
                  {displayMode === "kWh" ? `${totals.totalUsage.toFixed(0)} kWh` : `$${totals.totalDollars.toFixed(2)}`}
                </p>
                {displayMode === "kWh" && (
                  <p className="text-base text-foreground">
                    ${(totals.totalUsage * 0.057).toFixed(2)}
                  </p>
                )}
                
                {/* Previous Period Data - Only show when enabled */}
                {showPreviousMonth && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-muted-foreground mb-1">
                      {granularity === "24hours" ? "Previous Day" :
                       granularity === "daily" ? "Previous Month" :
                       "Previous Year"}
                    </p>
                                      <p className="text-sm font-semibold text-muted-foreground">
                    {displayMode === "kWh" ? `${totals.previousTotalUsage.toFixed(0)} kWh` : `$${totals.previousTotalDollars.toFixed(2)}`}
                  </p>
                  {displayMode === "kWh" && (
                    <p className="text-xs text-muted-foreground">
                      ${(totals.previousTotalUsage * 0.057).toFixed(2)}
                    </p>
                  )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-green-600 font-medium">
                    {granularity === "24hours" ? "Average Usage Per Hour" :
                     granularity === "daily" ? "Average Usage Per Day" :
                     "Average Usage Per Month"}
                  </p>
                  {totals.hasPreviousData && (
                    <span 
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        totals.avgUsageChange <= 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {totals.avgUsageChange > 0 ? '+' : ''}{totals.avgUsageChange.toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold">
                  {displayMode === "kWh" ? `${totals.avgUsage.toFixed(1)} kWh` : `$${totals.avgDollars.toFixed(2)}`}
                </p>
                {displayMode === "kWh" && (
                  <p className="text-base text-foreground">
                    ${(totals.avgUsage * 0.057).toFixed(2)}
                  </p>
                )}
                
                {/* Previous Period Data - Only show when enabled */}
                {showPreviousMonth && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-muted-foreground mb-1">
                      {granularity === "24hours" ? "Previous Day" :
                       granularity === "daily" ? "Previous Month" :
                       "Previous Year"}
                    </p>
                                      <p className="text-sm font-semibold text-muted-foreground">
                    {displayMode === "kWh" ? `${totals.previousAvgUsage.toFixed(1)} kWh` : `$${totals.previousAvgDollars.toFixed(2)}`}
                  </p>
                  {displayMode === "kWh" && (
                    <p className="text-xs text-muted-foreground">
                      ${(totals.previousAvgUsage * 0.057).toFixed(2)}
                    </p>
                  )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>



          {/* Previous Period Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Energy Consumption</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPreviousMonth"
                checked={showPreviousMonth}
                onChange={(e) => setShowPreviousMonth(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="showPreviousMonth" className="text-sm text-muted-foreground">
                {granularity === "24hours" ? "Show Previous Day" : 
                 granularity === "daily" ? "Show Previous Month" : 
                 "Show Previous Year"}
              </label>
            </div>
          </div>

          {/* Energy Usage Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis label={{ value: displayMode === "kWh" ? "Usage (kWh)" : "Cost ($)", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomChartLegend />} />
                {showPreviousMonth && (
                  <Bar
                    dataKey={displayMode === "kWh" ? "previousMonth" : "previousMonthDollars"}
                    fill={granularity === "24hours" ? "transparent" : "rgba(0, 0, 0, 0.3)"}
                    stroke={granularity === "24hours" ? "hsl(var(--muted-foreground))" : "none"}
                    strokeWidth={2}
                    name="Previous Period"
                  />
                )}
                <Bar
                  dataKey={displayMode === "kWh" ? "currentMonth" : "currentMonthDollars"}
                  fill={granularity === "24hours" ? "transparent" : "black"}
                  stroke={granularity === "24hours" ? "black" : "none"}
                  strokeWidth={2}
                  name="Current Period"
                >
                  {granularity === "24hours" && energyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.rateTier === 'on-peak' ? '#EF4444' : // Red for on-peak
                        entry.rateTier === 'mid-peak' ? '#F59E0B' : // Yellow for mid-peak
                        entry.rateTier === 'super-off-peak' ? '#10B981' : // Green for super off-peak
                        entry.rateTier === 'off-peak' ? '#3B82F6' : // Blue for off-peak
                        'transparent' // Transparent fill, only stroke visible
                      }
                      stroke="black"
                      strokeWidth={2}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Rate Tier Legend for 24 Hours View */}
          {granularity === "24hours" && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-3 text-center">SCE Time-of-Use Rate Tiers</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-xs">On-Peak (Summer 4-9 PM)<br/>$0.056/kWh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-xs">Mid-Peak (Winter 4-9 PM)<br/>$0.059/kWh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-xs">Super Off-Peak (Winter 8 AM-4 PM)<br/>$0.056/kWh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-xs">Off-Peak (All other hours)<br/>$0.057/kWh</span>
                </div>
              </div>
            </div>
          )}



          {/* Asset Cost Breakdown */}
          {selectedAsset === "all" && (
            <div>
              <h3 className="text-lg font-medium mb-3">Asset Cost Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assetCosts.map((asset) => (
                  <Card key={asset.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{asset.name}</h4>
                          <Badge variant="outline">${asset.rate}/kWh</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Usage:</span>
                            <span className="font-medium">{asset.usage.toFixed(0)} kWh</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {granularity === "24hours" ? "Hour Cost:" :
                               granularity === "daily" ? "Day Cost:" :
                               "Month Cost:"}
                            </span>
                            <span className="font-medium">${asset.cost.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-4 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-semibold">
                        Total {granularity === "24hours" ? "Hour" :
                               granularity === "daily" ? "Day" :
                               "Month"} Cost (All Assets)
                      </span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      ${assetCosts.reduce((sum, asset) => sum + asset.cost, 0).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
