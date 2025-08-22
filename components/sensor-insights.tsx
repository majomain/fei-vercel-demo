"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Thermometer, Zap, Activity, Waves, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { equipmentData } from "./equipment-list"

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
      const vibrationScore = calculateScore(vibrationSpikes, [0, 2, 4])
      const vibrationExplanation = generateExplanation("vibration", vibrationSpikes, vibrationScore)

      // Calculate overall score (average of all metrics)
      const overallScore = Math.round((tempScore + energyScore + mechanicalHealthScore) / 3)

      return {
        id: equipment.id,
        name: equipment.name,
        temperature: {
          averageTemp: -18 + Math.random() * 5, // -18°C to -13°C
          avgRecoveryTime: avgRecoveryTime,
          baselineRecoveryTime: baselineRecoveryTime,
          criticalThreshold: criticalThreshold,
          doorOpenEvents: doorOpenEvents,
          performanceScore: tempScore,
          performanceDescription: tempExplanation,
          unit: "°C",
        },
        energyEfficiency: {
          averageEnergy: averageEnergy,
          costPerCycle: costPerCycle,
          baselineEnergyPerCycle: baselineEnergyPerCycle,
          recoveryCycles24h: recoveryCycles24h,
          performanceScore: energyScore,
          performanceDescription: energyExplanation,
          unit: "kWh",
        },
        mechanicalHealth: {
          averageEnergy: 3 + Math.random() * 2, // 3-5 kWh
          costPerCycle: 1.5 + Math.random() * 0.5, // $1.5-2.0
          performanceScore: mechanicalHealthScore,
          performanceDescription: mechanicalHealthExplanation,
          baselineAmps: 5 + Math.random() * 2, // 5-7 A
          runningAmps: 6 + Math.random() * 1, // 6-7 A
          idleAmps: 4 + Math.random() * 1, // 4-5 A
          compressorRuntime: 1000 + Math.random() * 500, // 1000-1500 hours
        },
        vibration: {
          average: 0.5 + Math.random() * 0.5, // 0.5-1.0 mm/s
          unit: "mm/s",
          fluctuations: Math.floor(Math.random() * 5),
          spikes: vibrationSpikes,
          score: vibrationScore,
          explanation: vibrationExplanation,
        },
        overallScore,
      }
    })

    setSensorData(generatedData)

    // Set initial selected equipment
    if (selectedEquipmentId) {
      setSelectedEquipment(selectedEquipmentId)
    } else if (generatedData.length > 0) {
      setSelectedEquipment(generatedData[0].id)
    }

    setIsLoading(false)
  }, [selectedEquipmentId])

  // Calculate score based on thresholds
  const calculateScore = (value: number, thresholds: number[]): number => {
    if (value <= thresholds[0]) return 100
    if (value <= thresholds[1]) return 80 + Math.floor(Math.random() * 11) // 80-90
    if (value <= thresholds[2]) return 50 + Math.floor(Math.random() * 31) // 50-80
    return Math.max(20, 50 - Math.floor(Math.random() * 31)) // 20-49
  }

  // Calculate score based on efficiency percentage
  const calculateEfficiencyScore = (efficiency: number): number => {
    if (efficiency >= 90) return 100
    if (efficiency >= 80) return 80 + Math.floor(Math.random() * 11) // 80-90
    if (efficiency >= 50) return 50 + Math.floor(Math.random() * 31) // 50-80
    return Math.max(20, 50 - Math.floor(Math.random() * 31)) // 20-49
  }

  // Calculate temperature performance score based on recovery time deviation
  const calculateTemperatureScore = (avgRecoveryTime: number, baselineRecoveryTime: number, criticalThreshold: number): number => {
    // Calculate deviation from baseline
    const deviation = Math.abs(avgRecoveryTime - baselineRecoveryTime) / baselineRecoveryTime
    
    // If recovery time exceeds critical threshold (3x baseline), score is very low
    if (avgRecoveryTime >= criticalThreshold) {
      return Math.max(10, 30 - Math.floor(deviation * 100))
    }
    
    // Calculate score based on deviation: Temperature Score = 100 × (1 - Deviation)
    const score = Math.max(20, Math.round(100 * (1 - deviation)))
    return score
  }

  // Calculate energy efficiency performance score based on energy consumption vs baseline
  const calculateEnergyEfficiencyScore = (averageEnergy: number, baselineEnergyPerCycle: number): number => {
    const deviation = Math.abs(averageEnergy - baselineEnergyPerCycle) / baselineEnergyPerCycle
    if (averageEnergy >= baselineEnergyPerCycle * 1.5) { // Significant deviation (e.g., 50% more energy)
      return Math.max(10, 30 - Math.floor(deviation * 100))
    }
    if (averageEnergy >= baselineEnergyPerCycle * 1.2) { // Moderate deviation (e.g., 20% more energy)
      return Math.max(20, 50 - Math.floor(deviation * 100))
    }
    if (averageEnergy >= baselineEnergyPerCycle * 0.8) { // Slight deviation (e.g., 20% less energy)
      return Math.max(50, 70 - Math.floor(deviation * 100))
    }
    return Math.max(70, 90 - Math.floor(deviation * 100)) // Very low energy consumption
  }

  // Generate explanation text based on metric type and score
  const generateExplanation = (metricType: string, fluctuations: number, score: number): string => {
    if (score >= 90) {
      return `Excellent ${metricType} stability with minimal fluctuations.`
    } else if (score >= 80) {
      return `Good ${metricType} stability with ${fluctuations} minor fluctuations detected.`
    } else if (score >= 50) {
      return `Moderate ${metricType} instability with ${fluctuations} fluctuations detected.`
    } else {
      return `Critical ${metricType} instability with ${fluctuations} significant fluctuations detected.`
    }
  }

  // Generate explanation text for temperature recovery time analysis
  const generateTemperatureExplanation = (avgRecoveryTime: number, baselineRecoveryTime: number, score: number, doorEvents: number): string => {
    const deviation = Math.abs(avgRecoveryTime - baselineRecoveryTime)
    
    if (score >= 90) {
      return `Excellent cooling system stability. Recovery time: ${avgRecoveryTime.toFixed(1)}min (baseline: ${baselineRecoveryTime.toFixed(1)}min). ${doorEvents} door events handled efficiently.`
    } else if (score >= 80) {
      return `Good cooling system performance. Recovery time: ${avgRecoveryTime.toFixed(1)}min with ${deviation.toFixed(1)}min deviation from baseline. ${doorEvents} door events managed well.`
    } else if (score >= 50) {
      return `Moderate cooling system instability. Recovery time: ${avgRecoveryTime.toFixed(1)}min shows ${deviation.toFixed(1)}min deviation. ${doorEvents} door events may be affecting performance.`
    } else {
      return `Critical cooling system issues. Recovery time: ${avgRecoveryTime.toFixed(1)}min significantly exceeds baseline. ${doorEvents} door events causing major disruptions.`
    }
  }

  // Generate explanation text for energy efficiency
  const generateEnergyEfficiencyExplanation = (averageEnergy: number, baselineEnergyPerCycle: number, score: number, recoveryCycles24h: number, costPerCycle: number): string => {
    const deviation = Math.abs(averageEnergy - baselineEnergyPerCycle) / baselineEnergyPerCycle
    if (score >= 90) {
      return `Excellent energy efficiency. Current consumption: ${averageEnergy.toFixed(1)} kWh (baseline: ${baselineEnergyPerCycle.toFixed(1)} kWh). Cost per cycle: $${costPerCycle.toFixed(2)}. ${recoveryCycles24h} recovery cycles completed efficiently.`
    } else if (score >= 80) {
      return `Good energy efficiency. Current consumption: ${averageEnergy.toFixed(1)} kWh (baseline: ${baselineEnergyPerCycle.toFixed(1)} kWh). Cost per cycle: $${costPerCycle.toFixed(2)}. ${recoveryCycles24h} recovery cycles completed with minor deviations.`
    } else if (score >= 50) {
      return `Moderate energy efficiency. Current consumption: ${averageEnergy.toFixed(1)} kWh (baseline: ${baselineEnergyPerCycle.toFixed(1)} kWh). Cost per cycle: $${costPerCycle.toFixed(2)}. ${recoveryCycles24h} recovery cycles completed with moderate deviations.`
    } else {
      return `Poor energy efficiency. Current consumption: ${averageEnergy.toFixed(1)} kWh (baseline: ${baselineEnergyPerCycle.toFixed(1)} kWh). Cost per cycle: $${costPerCycle.toFixed(2)}. ${recoveryCycles24h} recovery cycles completed with significant deviations.`
    }
  }

  // Get score color class based on score value
  const getScoreColorClass = (score: number): string => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  // Get badge color class based on score value
  const getBadgeColorClass = (score: number): string => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 80) return "bg-green-50 text-green-600"
    if (score >= 50) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // Get progress color class based on score value
  const getProgressColorClass = (score: number): string => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-green-400"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9) / 5 + 32
  }

  // Get the selected equipment data
  const selectedEquipmentData = sensorData.find((item) => item.id === selectedEquipment)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sensor Insights</CardTitle>
          <CardDescription>Loading sensor data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Sensor Insights</CardTitle>
        <CardDescription>24-hour performance analysis based on sensor data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedEquipment || sensorData[0]?.id} onValueChange={setSelectedEquipment}>
          <TabsList className="mb-4 flex flex-nowrap overflow-x-auto pb-1">
            {sensorData.map((equipment) => (
              <TabsTrigger key={equipment.id} value={equipment.id} className="flex-shrink-0">
                {equipment.name}
                <Badge className={cn("ml-2", getBadgeColorClass(equipment.overallScore))}>
                  {equipment.overallScore}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {sensorData.map((equipment) => (
            <TabsContent key={equipment.id} value={equipment.id}>
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
                        Score: {equipment.temperature.performanceScore}
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
                            {equipment.temperature.averageTemp.toFixed(1)}°C /{" "}
                            {celsiusToFahrenheit(equipment.temperature.averageTemp).toFixed(1)}°F
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Recovery Time</p>
                          <p className="text-lg font-semibold">
                            {equipment.temperature.avgRecoveryTime.toFixed(1)} min
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Baseline Recovery</p>
                          <p className="text-lg font-semibold">
                            {equipment.temperature.baselineRecoveryTime.toFixed(1)} min
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
                            {equipment.temperature.performanceScore}%
                          </span>
                        </div>
                        <Progress
                          value={equipment.temperature.performanceScore}
                          className="h-2"
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
                              Based on 24hr average recovery time vs. baseline. Critical threshold: {equipment.temperature.criticalThreshold.toFixed(1)} minutes.
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
                        Score: {equipment.energyEfficiency.performanceScore}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Energy waste quantification and cost savings identification via Tasmota Energy Sensor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Average Energy</p>
                          <p className="text-lg font-semibold">
                            {equipment.energyEfficiency.averageEnergy.toFixed(1)} {equipment.energyEfficiency.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cost per Cycle</p>
                          <p className="text-lg font-semibold">
                            ${equipment.energyEfficiency.costPerCycle.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Baseline Energy</p>
                          <p className="text-lg font-semibold">
                            {equipment.energyEfficiency.baselineEnergyPerCycle.toFixed(1)} {equipment.energyEfficiency.unit}
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
                            {equipment.energyEfficiency.performanceScore}%
                          </span>
                        </div>
                        <Progress
                          value={equipment.energyEfficiency.performanceScore}
                          className="h-2"
                          indicatorClassName={getProgressColorClass(equipment.energyEfficiency.performanceScore)}
                        />
                      </div>

                      <div className="text-sm">
                        <div className="flex items-start">
                          <Info className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                          <p>{equipment.energyEfficiency.performanceDescription}</p>
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
                        <Activity className="mr-2 h-5 w-5 text-purple-500" />
                        <CardTitle className="text-base">Mechanical Health</CardTitle>
                      </div>
                      <Badge className={getBadgeColorClass(equipment.mechanicalHealth.performanceScore)}>
                        Score: {equipment.mechanicalHealth.performanceScore}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Physical wear and tear on core components measured by Tasmota Energy Sensor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Average Energy</p>
                          <p className="text-lg font-semibold">
                            {equipment.mechanicalHealth.averageEnergy.toFixed(1)} kWh
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cost per Cycle</p>
                          <p className="text-lg font-semibold">
                            ${equipment.mechanicalHealth.costPerCycle.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Baseline Amps</p>
                          <p className="text-lg font-semibold">
                            {equipment.mechanicalHealth.baselineAmps.toFixed(1)} A
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Running Amps</p>
                          <p className="text-lg font-semibold">
                            {equipment.mechanicalHealth.runningAmps.toFixed(1)} A
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Idle Amps</p>
                          <p className="text-lg font-semibold">
                            {equipment.mechanicalHealth.idleAmps.toFixed(1)} A
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Compressor Runtime</p>
                          <p className="text-lg font-semibold">
                            {equipment.mechanicalHealth.compressorRuntime.toFixed(0)} hours
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Performance Score</span>
                          <span className={cn("text-sm font-medium", getScoreColorClass(equipment.mechanicalHealth.performanceScore))}>
                            {equipment.mechanicalHealth.performanceScore}%
                          </span>
                        </div>
                        <Progress
                          value={equipment.mechanicalHealth.performanceScore}
                          className="h-2"
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
                      Score: {equipment.overallScore}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Overall Performance Score</span>
                        <span className={cn("text-sm font-medium", getScoreColorClass(equipment.overallScore))}>
                          {equipment.overallScore}%
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
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

