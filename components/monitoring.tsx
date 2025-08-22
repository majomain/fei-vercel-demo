"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { equipmentData } from "./equipment-list"

const predefinedLabels = [
  { name: "Front of House", color: "#3b82f6" },
  { name: "Back of House", color: "#10b981" },
  { name: "Kitchen", color: "#f59e0b" },
]

const celsiusToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32
const fahrenheitToCelsius = (fahrenheit: number) => ((fahrenheit - 32) * 5) / 9

const generateSampleData = (metric: string, timeFrame: string) => {
  const dataPoints = timeFrame === "hour" ? 60 : timeFrame === "day" ? 24 : timeFrame === "month" ? 30 : 12
  const baseValue = metric === "temperature" ? 25 : metric === "humidity" ? 45 : 75

  return Array.from({ length: dataPoints }, (_, i) => {
    const time =
      timeFrame === "hour"
        ? `${String(i).padStart(2, "0")}:00`
        : timeFrame === "day"
          ? `${String(i).padStart(2, "0")}:00`
          : timeFrame === "month"
            ? `Day ${i + 1}`
            : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]

    const dataPoint: any = { time }
    equipmentData.forEach((equipment, index) => {
      const equipmentKey = `equipment_${equipment.id}`
      // Vary the data based on equipment type for more realistic readings
      let variation = Math.random() * 10 - 5
      if (equipment.name.toLowerCase().includes("freezer")) {
        variation = Math.random() * 3 - 1.5 // Freezers have more stable readings
      } else if (equipment.name.toLowerCase().includes("blender")) {
        variation = Math.random() * 15 - 7.5 // Blenders have more variable readings
      }
      dataPoint[equipmentKey] = baseValue + variation
    })
    return dataPoint
  })
}

const getMetricConfig = (tempUnit: "C" | "F") => ({
  temperature: {
    label: "Temperature",
    unit: tempUnit === "C" ? "°C" : "°F",
    colors: ["#3b82f6", "#ef4444", "#eab308", "#06b6d4", "#8b5cf6"],
  },
  humidity: {
    label: "Humidity",
    unit: "%",
    colors: ["#3b82f6", "#ef4444", "#eab308", "#06b6d4", "#8b5cf6"],
  },
  power: {
    label: "Power Usage",
    unit: "kW",
    colors: ["#3b82f6", "#ef4444", "#eab308", "#06b6d4", "#8b5cf6"],
  },
})

export function Monitoring() {
  const [selectedMetric, setSelectedMetric] = useState<"temperature" | "humidity" | "power">("temperature")
  const [selectedAsset, setSelectedAsset] = useState("all")
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("day")
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C")
  const [selectedLabel, setSelectedLabel] = useState("all")

  const rawData = generateSampleData(selectedMetric, selectedTimeFrame)

  const data =
    selectedMetric === "temperature" && tempUnit === "F"
      ? rawData.map((point) => {
          const convertedPoint = { ...point }
          equipmentData.forEach((equipment) => {
            const key = `equipment_${equipment.id}`
            if (convertedPoint[key] !== undefined) {
              convertedPoint[key] = celsiusToFahrenheit(convertedPoint[key])
            }
          })
          return convertedPoint
        })
      : rawData

  const config = getMetricConfig(tempUnit)[selectedMetric]

  const timeFrameOptions = [
    { value: "hour", label: "Hour" },
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ]

  const filteredEquipmentData =
    selectedLabel === "all" ? equipmentData : equipmentData.filter((equipment) => equipment.label === selectedLabel)

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
        </div>

        {/* Metric Tabs */}
        <Tabs
          value={selectedMetric}
          onValueChange={(value) => setSelectedMetric(value as "temperature" | "humidity" | "power")}
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
            <TabsTrigger value="power">Power Usage</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedMetric} className="space-y-6">
            {/* Graph Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset Selection</label>
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      {filteredEquipmentData.map((equipment) => (
                        <SelectItem key={equipment.id} value={`equipment_${equipment.id}`}>
                          {equipment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Labels</SelectItem>
                      {predefinedLabels.map((label) => (
                        <SelectItem key={label.name} value={label.name}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
                            {label.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  {timeFrameOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedTimeFrame === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeFrame(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Screen Graph */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{config.label} Monitoring</span>
                  <div className="flex items-center gap-4">
                    {selectedMetric === "temperature" && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <Button
                            variant={tempUnit === "C" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setTempUnit("C")}
                            className="rounded-r-none border-r-0"
                          >
                            °C
                          </Button>
                          <Button
                            variant={tempUnit === "F" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setTempUnit("F")}
                            className="rounded-l-none"
                          >
                            °F
                          </Button>
                        </div>
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 80,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value.toFixed(1)}${config.unit}`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-md">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                                    <span className="font-bold text-muted-foreground">{label}</span>
                                  </div>
                                </div>
                                <div className="mt-2 space-y-1">
                                  {payload.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                      <span className="text-sm">
                                        {entry.name}: {entry.value?.toFixed(2)}
                                        {config.unit}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      {filteredEquipmentData.map((equipment, index) => {
                        const equipmentKey = `equipment_${equipment.id}`
                        const shouldShow = selectedAsset === "all" || selectedAsset === equipmentKey

                        if (!shouldShow) return null

                        return (
                          <Line
                            key={equipment.id}
                            type="monotone"
                            dataKey={equipmentKey}
                            stroke={config.colors[index % config.colors.length]}
                            strokeWidth={2}
                            dot={false}
                            name={equipment.name}
                          />
                        )
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend placed below the chart */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-wrap gap-6 justify-center">
                    {filteredEquipmentData.map((equipment, index) => {
                      const equipmentKey = `equipment_${equipment.id}`
                      const shouldShow = selectedAsset === "all" || selectedAsset === equipmentKey

                      if (!shouldShow) return null

                      return (
                        <div key={equipment.id} className="flex items-center gap-2">
                          <div
                            className="h-3 w-8 rounded"
                            style={{ backgroundColor: config.colors[index % config.colors.length] }}
                          />
                          <span className="text-sm text-muted-foreground">{equipment.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}

export const monitoring = Monitoring
