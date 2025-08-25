/**
 * Temperature utility functions for calculations and conversions
 */

/**
 * Converts Celsius to Fahrenheit
 * @param celsius - Temperature in Celsius
 * @returns Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32
}

/**
 * Converts Fahrenheit to Celsius
 * @param fahrenheit - Temperature in Fahrenheit
 * @returns Temperature in Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9
}

/**
 * Converts Kelvin to Celsius
 * @param kelvin - Temperature in Kelvin
 * @returns Temperature in Celsius
 */
export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15
}

/**
 * Converts Celsius to Kelvin
 * @param celsius - Temperature in Celsius
 * @returns Temperature in Kelvin
 */
export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15
}

/**
 * Calculates the average temperature from an array of values
 * @param temperatures - Array of temperature values
 * @returns Average temperature
 */
export function calculateAverageTemperature(temperatures: number[]): number {
  if (temperatures.length === 0) return 0
  return temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length
}

/**
 * Calculates temperature deviation from baseline
 * @param current - Current temperature
 * @param baseline - Baseline temperature
 * @returns Deviation percentage
 */
export function calculateTemperatureDeviation(current: number, baseline: number): number {
  if (baseline === 0) return 0
  return ((current - baseline) / baseline) * 100
}

/**
 * Checks if temperature is within acceptable range
 * @param temperature - Current temperature
 * @param min - Minimum acceptable temperature
 * @param max - Maximum acceptable temperature
 * @returns True if temperature is within range
 */
export function isTemperatureInRange(temperature: number, min: number, max: number): boolean {
  return temperature >= min && temperature <= max
}

/**
 * Formats temperature for different display contexts
 * @param value - Temperature value
 * @param context - Display context ('display', 'precision', 'compact')
 * @returns Formatted temperature string
 */
export function formatTemperatureForContext(value: number, context: 'display' | 'precision' | 'compact' = 'display'): string {
  switch (context) {
    case 'precision':
      return value.toFixed(2)
    case 'compact':
      return Math.round(value).toString()
    case 'display':
    default:
      return Math.round(value * 10) / 10 === Math.round(value) 
        ? Math.round(value).toString() 
        : (Math.round(value * 10) / 10).toString()
  }
}
