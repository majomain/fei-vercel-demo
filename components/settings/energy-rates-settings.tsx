"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useEnergyRates } from "@/contexts/energy-rates-context"
import { Settings, Zap, Clock, Sun, Snowflake, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EnergyRatesSettings() {
  const { rates, updateTouRate, updateSeasonalRate, resetToDefaults } = useEnergyRates()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const handleTouRateChange = (rateType: keyof typeof rates.touRates, value: string) => {
    const rate = parseFloat(value)
    if (!isNaN(rate) && rate >= 0) {
      updateTouRate(rateType, rate)
    }
  }

  const handleSeasonalRateChange = (season: keyof typeof rates.seasonalRates, rateType: string, value: string) => {
    const rate = parseFloat(value)
    if (!isNaN(rate) && rate >= 0) {
      updateSeasonalRate(season, rateType, rate)
    }
  }

  const handleReset = () => {
    resetToDefaults()
    toast({
      title: "Energy rates reset",
      description: "All energy rates have been reset to default values.",
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Energy rates saved",
      description: "Your energy rate configuration has been saved.",
    })
  }

  return (
    <Card id="energy-rates">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <CardTitle>Energy Rate Configuration</CardTitle>
              <CardDescription>
                Configure energy rates for accurate cost calculations
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Rates
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} variant="default">
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              </>
            )}
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">


        {/* Time-of-Use Rates */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            <h3 className="text-lg font-medium">Time-of-Use Rates ($/kWh)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="on-peak" className="text-sm font-medium">
                On-Peak (Summer 4-9 PM)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="on-peak"
                  type="number"
                  step="0.001"
                  min="0"
                  value={rates.touRates.onPeak}
                  onChange={(e) => handleTouRateChange('onPeak', e.target.value)}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <Badge variant="outline" className="px-3 py-2">
                  $/kWh
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mid-peak" className="text-sm font-medium">
                Mid-Peak (Winter 4-9 PM)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="mid-peak"
                  type="number"
                  step="0.001"
                  min="0"
                  value={rates.touRates.midPeak}
                  onChange={(e) => handleTouRateChange('midPeak', e.target.value)}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <Badge variant="outline" className="px-3 py-2">
                  $/kWh
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="super-off-peak" className="text-sm font-medium">
                Super Off-Peak (Winter 8 AM-4 PM)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="super-off-peak"
                  type="number"
                  step="0.001"
                  min="0"
                  value={rates.touRates.superOffPeak}
                  onChange={(e) => handleTouRateChange('superOffPeak', e.target.value)}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <Badge variant="outline" className="px-3 py-2">
                  $/kWh
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="off-peak" className="text-sm font-medium">
                Off-Peak (All other hours)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="off-peak"
                  type="number"
                  step="0.001"
                  min="0"
                  value={rates.touRates.offPeak}
                  onChange={(e) => handleTouRateChange('offPeak', e.target.value)}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <Badge variant="outline" className="px-3 py-2">
                  $/kWh
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Seasonal Rate Overrides */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-orange-500" />
            <h3 className="text-lg font-medium">Seasonal Rate Overrides</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summer Rates */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-orange-500" />
                <h4 className="font-medium">Summer (Jun-Sep)</h4>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    value={rates.seasonalRates.summer.onPeak}
                    onChange={(e) => handleSeasonalRateChange('summer', 'onPeak', e.target.value)}
                    disabled={!isEditing}
                    placeholder="On-Peak"
                    className="flex-1"
                  />
                  <Badge variant="outline" className="px-2 py-1 text-xs">
                    On-Peak
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    value={rates.seasonalRates.summer.midPeak}
                    onChange={(e) => handleSeasonalRateChange('summer', 'midPeak', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Mid-Peak"
                    className="flex-1"
                  />
                  <Badge variant="outline" className="px-2 py-1 text-xs">
                    Mid-Peak
                  </Badge>
                </div>
              </div>
            </div>

            {/* Winter Rates */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Snowflake className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium">Winter (Dec-Mar)</h4>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    value={rates.seasonalRates.winter.midPeak}
                    onChange={(e) => handleSeasonalRateChange('winter', 'midPeak', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Mid-Peak"
                    className="flex-1"
                  />
                  <Badge variant="outline" className="px-2 py-1 text-xs">
                    Mid-Peak
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    value={rates.seasonalRates.winter.superOffPeak}
                    onChange={(e) => handleSeasonalRateChange('winter', 'superOffPeak', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Super Off-Peak"
                    className="flex-1"
                  />
                  <Badge variant="outline" className="px-2 py-1 text-xs">
                    Super Off-Peak
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Note */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> These rates are used to calculate energy costs in the Energy Usage Summary. 
            Update them to match your utility provider's current rates for accurate cost calculations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
