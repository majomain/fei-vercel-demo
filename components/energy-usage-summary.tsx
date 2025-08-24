"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts"
import { Zap, Calendar, TrendingUp } from "lucide-react"
import { equipmentData } from "./equipment-list"

interface EnergyDataPoint {
  period: string
  currentMonth: number
  previousMonth?: number
  rateTier?: 'on-peak' | 'mid-peak' | 'off-peak' | 'super-off-peak'
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
  const [granularity, setGranularity] = useState<"24hours" | "monthly" | "yearly">("24hours")
  const [showPreviousMonth, setShowPreviousMonth] = useState(false)
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
      const isWeekend = today.getDay() === 0 || today.getDay() === 6
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
          previousMonth: showPreviousMonth && isPastHour ? Math.max(0, previousDayUsage) : 0,
          rateTier: isPastHour ? rateTier : undefined
        })
      }
    } else if (granularity === "monthly") {
      // Monthly data for current year
      const currentMonthNum = today.getMonth()
      
      for (let month = 0; month <= currentMonthNum; month++) {
        const baseUsage = selectedAsset === "all" 
          ? equipmentData.reduce((sum, eq) => sum + (1500 + Math.random() * 900), 0)
          : 1500 + Math.random() * 900
        
        const monthlyUsage = baseUsage + Math.sin(month / 3) * 300 + (Math.random() * 600 - 300)
        const previousYearUsage = baseUsage + Math.sin(month / 3) * 240 + (Math.random() * 450 - 225)
        
        data.push({
          period: new Date(currentYear, month).toLocaleDateString('en-US', { month: 'short' }),
          currentMonth: Math.max(0, monthlyUsage),
          previousMonth: showPreviousMonth ? Math.max(0, previousYearUsage) : 0
        })
      }
    } else {
      // Yearly data for multiple years
      const currentYearNum = today.getFullYear()
      
      for (let year = currentYearNum - 2; year <= currentYearNum; year++) {
        const baseUsage = selectedAsset === "all" 
          ? equipmentData.reduce((sum, eq) => sum + (18000 + Math.random() * 12000), 0)
          : 18000 + Math.random() * 12000
        
        const yearlyUsage = baseUsage + Math.sin(year / 2) * 3000 + (Math.random() * 6000 - 3000)
        const previousYearUsage = baseUsage + Math.sin((year - 1) / 2) * 2400 + (Math.random() * 4500 - 2250)
        
        data.push({
          period: year.toString(),
          currentMonth: Math.max(0, yearlyUsage),
          previousMonth: showPreviousMonth ? Math.max(0, previousYearUsage) : 0
        })
      }
    }
    
    setEnergyData(data)
  }, [selectedAsset, granularity, showPreviousMonth])

  // Calculate asset costs
  useEffect(() => {
    const costs: AssetCost[] = equipmentData.map((equipment) => {
      const monthlyUsage = 800 + Math.random() * 400 // kWh per month
      const rate = energyRates[equipment.type as keyof typeof energyRates] || 0.11
      const monthlyCost = monthlyUsage * rate

      return {
        id: `equipment${equipment.id}`,
        name: equipment.name,
        usage: monthlyUsage,
        cost: monthlyCost,
        rate,
      }
    })

    setAssetCosts(costs)
  }, [])

  // Calculate totals for current month
  const totals = useMemo(() => {
    const totalUsage = energyData.reduce((sum, d) => sum + (d.currentMonth || 0), 0)
    const avgUsage = energyData.length > 0 ? totalUsage / energyData.length : 0
    
    return {
      totalUsage,
      avgUsage,
    }
  }, [energyData])

  const CustomChartLegend = ({ payload }: any) => {
    return (
      <ul className="flex justify-center gap-x-4 mt-2">
        {payload.map((entry: any, index: number) => {
          const { value } = entry;
          
          // Only render legend items for the date series (currentMonth and previousMonth)
          if (value.includes("Sun,")) {
            // Today's data - black stroke
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
                {value}
              </li>
            );
          } else if (value.includes("Sat,")) {
            // Previous day data - grey stroke
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
                {value}
              </li>
            );
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
          <p className="text-sm text-muted-foreground">
            {granularity === "24hours" ? (
              <>
                {(() => {
                  const today = new Date()
                  const dayName = today.toLocaleDateString('en-US', { weekday: 'short' })
                  const day = today.getDate()
                  const month = today.toLocaleDateString('en-US', { month: 'short' })
                  return `${dayName}, ${day} ${month}`
                })()}: <span className="font-medium">{data.currentMonth?.toFixed(1) || 'No data'} kWh</span>
              </>
            ) : (
              <>
                Current Period: <span className="font-medium">{data.currentMonth?.toFixed(1) || 'No data'} kWh</span>
              </>
            )}
          </p>
          {data.previousMonth && (
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
                  })()}: <span className="font-medium">{data.previousMonth.toFixed(1)} kWh</span>
                </>
              ) : (
                <>
                  Previous Period: <span className="font-medium">{data.previousMonth.toFixed(1)} kWh</span>
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
            <Select value={granularity} onValueChange={(value: "24hours" | "monthly" | "yearly") => setGranularity(value)}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Granularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hours">24 Hours</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 font-medium">
                      {granularity === "24hours" ? "Daily Total Usage" :
                       granularity === "monthly" ? "Monthly Total Usage" :
                       "Yearly Total Usage"}
                    </p>
                    <p className="text-lg font-bold">{totals.totalUsage.toFixed(0)} kWh</p>
                    <p className="text-sm text-blue-700 font-medium">
                      ${(totals.totalUsage * 0.057).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-xs text-green-600 font-medium">
                      {granularity === "24hours" ? "Average Usage Per Hour" :
                       granularity === "monthly" ? "Average Usage Per Month" :
                       "Average Usage Per Year"}
                    </p>
                    <p className="text-lg font-bold">{totals.avgUsage.toFixed(1)} kWh</p>
                    <p className="text-sm text-green-700 font-medium">
                      ${(totals.avgUsage * 0.057).toFixed(2)}
                    </p>
                  </div>
                </div>
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
                 granularity === "monthly" ? "Show Previous Month" : 
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
                <YAxis label={{ value: "Energy Usage (kWh)", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomChartLegend />} />
                <Bar
                  dataKey="currentMonth"
                  fill="transparent"
                  stroke="black"
                  strokeWidth={2}
                  name={(() => {
                    const today = new Date()
                    const dayName = today.toLocaleDateString('en-US', { weekday: 'short' })
                    const day = today.getDate()
                    const month = today.toLocaleDateString('en-US', { month: 'short' })
                    return `${dayName}, ${day} ${month}`
                  })()}
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
                {showPreviousMonth && (
                  <Bar
                    dataKey="previousMonth"
                    fill="transparent"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    name={(() => {
                      const yesterday = new Date()
                      yesterday.setDate(yesterday.getDate() - 1)
                      const dayName = yesterday.toLocaleDateString('en-US', { weekday: 'short' })
                      const day = yesterday.getDate()
                      const month = yesterday.toLocaleDateString('en-US', { month: 'short' })
                      return `${dayName}, ${day} ${month}`
                    })()}
                  />
                )}
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
                            <span className="text-muted-foreground">Monthly Cost:</span>
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
                      <span className="font-semibold">Total Monthly Cost (All Assets)</span>
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
