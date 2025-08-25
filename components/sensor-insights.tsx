"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Thermometer, Zap, Activity, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { equipmentData } from "./equipment-list"
import { formatTemperature, formatTemperatureWithUnit } from "@/lib/format-temperature"
import { celsiusToFahrenheit } from "@/lib/temperature-utils"

type SensorMetric = {
  average: number
  unit: string
  fluctuations: number
  spikes: number
  score: number
  explanation: string
}

type TemperatureMetric = {
  averageTemp: number
  avgRecoveryTime: number
  baselineRecoveryTime: number
  criticalThreshold: number
  doorOpenEvents: number
  performanceScore: number
  performanceDescription: string
  unit: string
}

type EnergyEfficiencyMetric = {
  averageEnergy: number
  costPerCycle: number
  baselineEnergyPerCycle: number
  recoveryCycles24h: number
  performanceScore: number
  performanceDescription: string
  unit: string
}

type MechanicalHealthMetric = {
  averageEnergy: number
  costPerCycle: number
  performanceScore: number
  performanceDescription: string
  baselineAmps: number
  runningAmps: number
  idleAmps: number
  compressorRuntime: number
}

type EquipmentSensorData = {
  id: string
  name: string
  temperature: TemperatureMetric
  energyEfficiency: EnergyEfficiencyMetric
  mechanicalHealth: MechanicalHealthMetric
  vibration: SensorMetric
  overallScore: number
}

export function SensorInsights({ selectedEquipmentId }: { selectedEquipmentId?: string }) {
  const [sensorData, setSensorData] = useState<EquipmentSensorData[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Generate mock sensor data for each equipment
  useEffect(() => {
    setIsLoading(true)

    // Generate data for all equipment
    const generatedData: EquipmentSensorData[] = equipmentData.map((equipment) => {
      // Temperature data - Recovery time analysis
      const baselineRecoveryTime = 12 + Math.random() * 3 // 12-15 minutes baseline
      const avgRecoveryTime = baselineRecoveryTime + (Math.random() * 6 - 3) // ±3 minutes variation
      const doorOpenEvents = Math.floor(Math.random() * 4) // 0-3 events
      const criticalThreshold = baselineRecoveryTime * 3 // 3x baseline
      
      // Calculate temperature performance score based on recovery time deviation
      const tempScore = calculateTemperatureScore(avgRecoveryTime, baselineRecoveryTime, criticalThreshold)
      const tempExplanation = generateTemperatureExplanation(avgRecoveryTime, baselineRecoveryTime, tempScore, doorOpenEvents)

      // Energy efficiency data - Energy waste and cost analysis
      const baselineEnergyPerCycle = 1.8 + Math.random() * 0.4 // 1.8-2.2 kWh baseline
      const averageEnergy = baselineEnergyPerCycle + (Math.random() * 0.8 - 0.4) // ±0.4 kWh variation
      const costPerCycle = averageEnergy * (0.12 + Math.random() * 0.08) // $0.12-0.20 per kWh
      const recoveryCycles24h = 8 + Math.floor(Math.random() * 6) // 8-13 cycles
      
      // Calculate energy efficiency performance score based on energy consumption vs baseline
      const energyScore = calculateEnergyEfficiencyScore(averageEnergy, baselineEnergyPerCycle)
      const energyExplanation = generateEnergyEfficiencyExplanation(averageEnergy, baselineEnergyPerCycle, energyScore, recoveryCycles24h, costPerCycle)

      // Mechanical Health data
      const mechanicalHealthScore = calculateScore(Math.floor(Math.random() * 10), [1, 3, 6])
      const mechanicalHealthExplanation = generateExplanation("mechanical health", Math.floor(Math.random() * 10), mechanicalHealthScore)

      // Vibration data
      const vibrationSpikes = Math.floor(Math.random() * 6) // 0-5 spikes
      const vibrationScore = calculateScore(vibrationSpikes, [1, 3, 6])
      const vibrationExplanation = generateExplanation("vibration", vibrationSpikes, vibrationScore)

      // Overall score calculation
      const overallScore = Math.round((tempScore + energyScore + mechanicalHealthScore + vibrationScore) / 4)

      return {
        id: equipment.id,
        name: equipment.name,
        temperature: {
          averageTemp: 2.5 + Math.random() * 3, // 2.5-5.5°C
          avgRecoveryTime,
          baselineRecoveryTime,
          criticalThreshold,
          doorOpenEvents,
          performanceScore: tempScore,
          performanceDescription: tempExplanation,
          unit: "°C"
        },
        energyEfficiency: {
          averageEnergy,
          costPerCycle,
          baselineEnergyPerCycle,
          recoveryCycles24h,
          performanceScore: energyScore,
          performanceDescription: energyExplanation,
          unit: "kWh"
        },
        mechanicalHealth: {
          averageEnergy: 2.1 + Math.random() * 0.6, // 2.1-2.7 kWh
          costPerCycle: (2.1 + Math.random() * 0.6) * (0.12 + Math.random() * 0.08),
          performanceScore: mechanicalHealthScore,
          performanceDescription: mechanicalHealthExplanation,
          baselineAmps: 8.5 + Math.random() * 1.5, // 8.5-10.0 amps
          runningAmps: 8.5 + Math.random() * 2.5, // 8.5-11.0 amps
          idleAmps: 2.0 + Math.random() * 1.0, // 2.0-3.0 amps
          compressorRuntime: 65 + Math.random() * 20 // 65-85% runtime
        },
        vibration: {
          average: 0.8 + Math.random() * 0.4, // 0.8-1.2 g
          unit: "g",
          fluctuations: Math.floor(Math.random() * 8), // 0-7 fluctuations
          spikes: vibrationSpikes,
          score: vibrationScore,
          explanation: vibrationExplanation
        },
        overallScore
      }
    })

    setSensorData(generatedData)
    setSelectedEquipment(selectedEquipmentId || generatedData[0]?.id || null)
    setIsLoading(false)
  }, [selectedEquipmentId])

  // Helper functions
  function calculateScore(value: number, thresholds: number[]): number {
    if (value <= thresholds[0]) return 95 + Math.random() * 5 // 95-100
    if (value <= thresholds[1]) return 80 + Math.random() * 15 // 80-95
    if (value <= thresholds[2]) return 60 + Math.random() * 20 // 60-80
    return 40 + Math.random() * 20 // 40-60
  }

  function calculateTemperatureScore(avgRecovery: number, baseline: number, critical: number): number {
    const deviation = Math.abs(avgRecovery - baseline) / baseline
    if (deviation <= 0.1) return 95 + Math.random() * 5 // 95-100
    if (deviation <= 0.25) return 80 + Math.random() * 15 // 80-95
    if (deviation <= 0.5) return 60 + Math.random() * 20 // 60-80
    return 40 + Math.random() * 20 // 40-60
  }

  function calculateEnergyEfficiencyScore(average: number, baseline: number): number {
    const efficiency = baseline / average
    if (efficiency >= 1.1) return 95 + Math.random() * 5 // 95-100
    if (efficiency >= 1.0) return 80 + Math.random() * 15 // 80-95
    if (efficiency >= 0.9) return 60 + Math.random() * 20 // 60-80
    return 40 + Math.random() * 20 // 40-60
  }

  function generateExplanation(metric: string, value: number, score: number): string {
    if (score >= 80) {
      return `${metric.charAt(0).toUpperCase() + metric.slice(1)} is performing excellently with minimal fluctuations.`
    } else if (score >= 60) {
      return `${metric.charAt(0).toUpperCase() + metric.slice(1)} shows moderate stability with some variations.`
    } else {
      return `${metric.charAt(0).toUpperCase() + metric.slice(1)} requires attention due to significant fluctuations.`
    }
  }

  function generateTemperatureExplanation(avgRecovery: number, baseline: number, score: number, doorEvents: number): string {
    if (score >= 80) {
      return `Temperature recovery is excellent. Recovery time: ${formatTemperature(avgRecovery, 1)} min (baseline: ${formatTemperature(baseline, 1)} min). Door events: ${doorEvents}.`
    } else if (score >= 60) {
      return `Temperature recovery is acceptable. Recovery time: ${formatTemperature(avgRecovery, 1)} min (baseline: ${formatTemperature(baseline, 1)} min). Door events: ${doorEvents}.`
    } else {
      return `Temperature recovery needs improvement. Recovery time: ${formatTemperature(avgRecovery, 1)} min (baseline: ${formatTemperature(baseline, 1)} min). Door events: ${doorEvents}.`
    }
  }

  function generateEnergyEfficiencyExplanation(average: number, baseline: number, score: number, cycles: number, cost: number): string {
    if (score >= 80) {
      return `Energy efficiency is excellent. Average: ${formatTemperature(average, 2)} kWh/cycle (baseline: ${formatTemperature(baseline, 2)} kWh). ${cycles} cycles/24h, cost: $${formatTemperature(cost, 2)}/cycle.`
    } else if (score >= 60) {
      return `Energy efficiency is acceptable. Average: ${formatTemperature(average, 2)} kWh/cycle (baseline: ${formatTemperature(baseline, 2)} kWh). ${cycles} cycles/24h, cost: $${formatTemperature(cost, 2)}/cycle.`
    } else {
      return `Energy efficiency needs improvement. Average: ${formatTemperature(average, 2)} kWh/cycle (baseline: ${formatTemperature(baseline, 2)} kWh). ${cycles} cycles/24h, cost: $${formatTemperature(cost, 2)}/cycle.`
    }
  }

  function getBadgeColorClass(score: number): string {
    if (score >= 80) return "bg-green-100 text-green-800 hover:bg-green-100"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    return "bg-red-100 text-red-800 hover:bg-red-100"
  }

  function getScoreColorClass(score: number): string {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  function getProgressColorClass(score: number): string {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }



  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get the selected equipment data
  const equipment = sensorData.find((item) => item.id === selectedEquipment) || sensorData[0]
  if (!equipment) return null

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Sensor Insights</CardTitle>
        <CardDescription>24-hour performance analysis based on sensor data</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Asset Selection Dropdown */}
        <div className="mb-4">
          <Select value={selectedEquipment || sensorData[0]?.id} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select an asset" />
            </SelectTrigger>
            <SelectContent>
              {sensorData.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{equipment.name}</span>
                    <Badge className={cn("ml-2", getBadgeColorClass(equipment.overallScore))}>
                      {equipment.overallScore}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Asset Content - Show only selected asset */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Temperature Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Thermometer className="mr-2 h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">Temperature</CardTitle>
                </div>
                <Badge className={getBadgeColorClass(equipment.temperature.performanceScore)}>
                  Score: {formatTemperature(equipment.temperature.performanceScore, 0)}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Cooling system stability and resilience via Ruuvi Tag Temperature Sensor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Temperature</p>
                    <p className="text-lg font-semibold">
                      {formatTemperatureWithUnit(equipment.temperature.averageTemp, "°C")} /{" "}
                      {formatTemperatureWithUnit(celsiusToFahrenheit(equipment.temperature.averageTemp), "°F")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recovery Time</p>
                    <p className="text-lg font-semibold">
                      {formatTemperature(equipment.temperature.avgRecoveryTime, 0)} min
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Baseline Recovery</p>
                    <p className="text-lg font-semibold">
                      {formatTemperature(equipment.temperature.baselineRecoveryTime, 0)} min
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Door Events (24h)</p>
                    <p className="text-lg font-semibold">
                      {equipment.temperature.doorOpenEvents}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Performance Score</span>
                    <span className={cn("text-sm font-medium", getScoreColorClass(equipment.temperature.performanceScore))}>
                      {formatTemperature(equipment.temperature.performanceScore, 0)}%
                    </span>
                  </div>
                  <Progress
                    value={equipment.temperature.performanceScore}
                    className="h-3"
                    indicatorClassName={getProgressColorClass(equipment.temperature.performanceScore)}
                  />
                </div>

                <div className="text-sm">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium mb-1">Performance Analysis:</p>
                      <p>{equipment.temperature.performanceDescription}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Based on 24hr average recovery time vs. baseline. Door events indicate operational interruptions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Energy Efficiency Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-base">Energy Efficiency</CardTitle>
                </div>
                <Badge className={getBadgeColorClass(equipment.energyEfficiency.performanceScore)}>
                  Score: {formatTemperature(equipment.energyEfficiency.performanceScore, 0)}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Power consumption optimization and cost analysis via Power Meter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Energy</p>
                    <p className="text-lg font-semibold">
                      {formatTemperature(equipment.energyEfficiency.averageEnergy, 2)} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost Per Cycle</p>
                    <p className="text-lg font-semibold">
                      ${formatTemperature(equipment.energyEfficiency.costPerCycle, 2)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Baseline Energy</p>
                    <p className="text-lg font-semibold">
                      {formatTemperature(equipment.energyEfficiency.baselineEnergyPerCycle, 2)} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recovery Cycles (24h)</p>
                    <p className="text-lg font-semibold">
                      {equipment.energyEfficiency.recoveryCycles24h}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Performance Score</span>
                    <span className={cn("text-sm font-medium", getScoreColorClass(equipment.energyEfficiency.performanceScore))}>
                      {formatTemperature(equipment.energyEfficiency.performanceScore, 0)}%
                    </span>
                  </div>
                  <Progress
                    value={equipment.energyEfficiency.performanceScore}
                    className="h-3"
                    indicatorClassName={getProgressColorClass(equipment.energyEfficiency.performanceScore)}
                  />
                </div>

                <div className="text-sm">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium mb-1">Performance Analysis:</p>
                      <p>{equipment.energyEfficiency.performanceDescription}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Based on 24hr average energy consumption vs. baseline. Cost analysis includes current utility rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mechanical Health Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-green-500" />
                  <CardTitle className="text-base">Mechanical Health</CardTitle>
                </div>
                <Badge className={getBadgeColorClass(equipment.mechanicalHealth.performanceScore)}>
                  Score: {formatTemperature(equipment.mechanicalHealth.performanceScore, 0)}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Electrical system stability and compressor performance via Current Sensor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Running Amps</p>
                    <p className="text-lg font-semibold">
                      {formatTemperature(equipment.mechanicalHealth.runningAmps, 1)} A
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Baseline Amps</p>
                    <p className="text-lg font-semibold">
                      {formatTemperature(equipment.mechanicalHealth.baselineAmps, 1)} A
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Idle Amps</p>
                    <p className="text-lg font-semibold">
                      {formatTemperature(equipment.mechanicalHealth.idleAmps, 1)} A
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compressor Runtime</p>
                    <p className="text-lg font-semibold">
                      {formatTemperature(equipment.mechanicalHealth.compressorRuntime, 0)}%
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Performance Score</span>
                    <span className={cn("text-sm font-medium", getScoreColorClass(equipment.mechanicalHealth.performanceScore))}>
                      {formatTemperature(equipment.mechanicalHealth.performanceScore, 0)}%
                    </span>
                  </div>
                  <Progress
                    value={equipment.mechanicalHealth.performanceScore}
                    className="h-3"
                    indicatorClassName={getProgressColorClass(equipment.mechanicalHealth.performanceScore)}
                  />
                </div>

                <div className="text-sm">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium mb-1">Performance Analysis:</p>
                      <p>{equipment.mechanicalHealth.performanceDescription}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Based on 24hr average running amps vs. baseline. Compressor on determined by &gt; idle amps threshold.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Performance Summary */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Overall Performance Summary</CardTitle>
                                            <Badge className={getBadgeColorClass(equipment.overallScore)}>
                Score: {formatTemperature(equipment.overallScore, 0)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Overall Performance Score</span>
                  <span className={cn("text-sm font-medium", getScoreColorClass(equipment.overallScore))}>
                    {formatTemperature(equipment.overallScore, 0)}%
                  </span>
                </div>
                <Progress
                  value={equipment.overallScore}
                  className="h-3"
                  indicatorClassName={getProgressColorClass(equipment.overallScore)}
                />
              </div>

              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-start">
                  {equipment.overallScore >= 80 ? (
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                  ) : equipment.overallScore >= 50 ? (
                    <Info className="h-5 w-5 mr-2 mt-0.5 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {equipment.overallScore >= 80
                        ? "Equipment is performing well"
                        : equipment.overallScore >= 50
                          ? "Equipment requires attention"
                          : "Equipment requires immediate maintenance"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {equipment.overallScore >= 80
                        ? "All systems are operating within optimal parameters with minor fluctuations."
                        : equipment.overallScore >= 50
                          ? "Some systems are showing moderate instability. Scheduled maintenance is recommended."
                          : "Multiple systems are showing critical instability. Immediate maintenance is required to prevent failure."}
                    </p>
                    {equipment.overallScore < 80 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Recommended actions:</p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                          {equipment.temperature.performanceScore < 80 && (
                            <li>Check temperature control systems and sensors</li>
                          )}
                          {equipment.energyEfficiency.performanceScore < 80 && (
                            <li>Inspect power supply and energy management systems</li>
                          )}
                          {equipment.mechanicalHealth.performanceScore < 80 && (
                            <li>Evaluate electrical components and connections</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

