/**
 * Utility functions for temperature formatting and conversion
 */

/**
 * Formats a temperature value to a reasonable number of decimal places
 * @param value - Temperature value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted temperature string
 */
export function formatTemperature(value: number, decimals: number = 1): string {
  if (decimals === 0) {
    return Math.round(value).toString()
  }
  
  const multiplier = Math.pow(10, decimals)
  const rounded = Math.round(value * multiplier) / multiplier
  
  // Remove trailing zeros after decimal point
  return rounded.toString().replace(/\.?0+$/, '')
}

/**
 * Formats a temperature value for display with unit
 * @param value - Temperature value
 * @param unit - Temperature unit (e.g., '°C', '°F')
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted temperature string with unit
 */
export function formatTemperatureWithUnit(value: number, unit: string, decimals: number = 1): string {
  const formatted = formatTemperature(value, decimals)
  return `${formatted}${unit}`
}

/**
 * Formats a range of temperatures
 * @param min - Minimum temperature
 * @param max - Maximum temperature
 * @param unit - Temperature unit
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted temperature range string
 */
export function formatTemperatureRange(min: number, max: number, unit: string, decimals: number = 1): string {
  const minFormatted = formatTemperature(min, decimals)
  const maxFormatted = formatTemperature(max, decimals)
  return `${minFormatted} - ${maxFormatted}${unit}`
}
