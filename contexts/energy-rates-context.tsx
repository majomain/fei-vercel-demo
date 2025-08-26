"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface EnergyRateConfig {
  // Equipment-specific rates
  equipmentRates: {
    [equipmentType: string]: number;
  };
  
  // Time-of-Use rates
  touRates: {
    onPeak: number;
    midPeak: number;
    superOffPeak: number;
    offPeak: number;
  };
  
  // Seasonal adjustments
  seasonalRates: {
    summer: {
      onPeak: number;
      midPeak: number;
    };
    winter: {
      midPeak: number;
      superOffPeak: number;
    };
  };
}

const defaultRates: EnergyRateConfig = {
  equipmentRates: {
    "Refrigeration Unit": 0.12,
    "HVAC System": 0.1,
    Compressor: 0.15,
    "Conveyor Belt": 0.08,
    "Packaging Machine": 0.11,
  },
  touRates: {
    onPeak: 0.056,
    midPeak: 0.059,
    superOffPeak: 0.056,
    offPeak: 0.057,
  },
  seasonalRates: {
    summer: {
      onPeak: 0.056,
      midPeak: 0.059,
    },
    winter: {
      midPeak: 0.059,
      superOffPeak: 0.056,
    },
  },
}

interface EnergyRatesContextType {
  rates: EnergyRateConfig;
  setRates: (rates: EnergyRateConfig) => void;
  updateEquipmentRate: (equipmentType: string, rate: number) => void;
  updateTouRate: (rateType: keyof EnergyRateConfig['touRates'], rate: number) => void;
  updateSeasonalRate: (season: keyof EnergyRateConfig['seasonalRates'], rateType: string, rate: number) => void;
  resetToDefaults: () => void;
}

const EnergyRatesContext = createContext<EnergyRatesContextType | null>(null)

export function EnergyRatesProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<EnergyRateConfig>(defaultRates)

  // Load rates from localStorage on mount
  useEffect(() => {
    const savedRates = localStorage.getItem('energyRates')
    if (savedRates) {
      try {
        const parsedRates = JSON.parse(savedRates)
        setRates({ ...defaultRates, ...parsedRates })
      } catch (error) {
        console.error('Failed to parse saved energy rates:', error)
      }
    }
  }, [])

  // Save rates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('energyRates', JSON.stringify(rates))
  }, [rates])

  const updateEquipmentRate = (equipmentType: string, rate: number) => {
    setRates(prev => ({
      ...prev,
      equipmentRates: {
        ...prev.equipmentRates,
        [equipmentType]: rate
      }
    }))
  }

  const updateTouRate = (rateType: keyof EnergyRateConfig['touRates'], rate: number) => {
    setRates(prev => ({
      ...prev,
      touRates: {
        ...prev.touRates,
        [rateType]: rate
      }
    }))
  }

  const updateSeasonalRate = (season: keyof EnergyRateConfig['seasonalRates'], rateType: string, rate: number) => {
    setRates(prev => ({
      ...prev,
      seasonalRates: {
        ...prev.seasonalRates,
        [season]: {
          ...prev.seasonalRates[season],
          [rateType]: rate
        }
      }
    }))
  }

  const resetToDefaults = () => {
    setRates(defaultRates)
  }

  return (
    <EnergyRatesContext.Provider value={{
      rates,
      setRates,
      updateEquipmentRate,
      updateTouRate,
      updateSeasonalRate,
      resetToDefaults
    }}>
      {children}
    </EnergyRatesContext.Provider>
  )
}

export function useEnergyRates() {
  const context = useContext(EnergyRatesContext)
  if (!context) {
    throw new Error('useEnergyRates must be used within an EnergyRatesProvider')
  }
  return context
}
