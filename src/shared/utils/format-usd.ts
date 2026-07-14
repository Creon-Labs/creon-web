/**
 * Options for formatting a USD nominal value.
 */
export type FormatUsdOptions = {
  /**
   * Minimum number of fraction digits to display.
   * @default 0
   */
  minimumFractionDigits?: number
  /**
   * Maximum number of fraction digits to display.
   * @default 2
   */
  maximumFractionDigits?: number
  /**
   * Whether to show the USD currency symbol/code.
   * @default true
   */
  showSymbol?: boolean
  /**
   * Notation style — use "compact" for abbreviated large numbers (e.g. $1.2M).
   * @default "standard"
   */
  notation?: "standard" | "compact" | "scientific" | "engineering"
}

/**
 * Formats a numeric value as a USD currency string.
 *
 * @example
 * formatUsd(1234567.89)          // "$1,234,567.89"
 * formatUsd(0.5)                 // "$0.50"
 * formatUsd(1000, { notation: "compact" }) // "$1K"
 * formatUsd(99.9, { minimumFractionDigits: 2 }) // "$99.90"
 * formatUsd(50, { showSymbol: false }) // "50"
 */
export function formatUsd(
  value: number,
  options: FormatUsdOptions = {}
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    showSymbol = true,
    notation = "standard",
  } = options

  if (!showSymbol) {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits,
      maximumFractionDigits,
      notation,
    }).format(value)
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
  }).format(value)
}

/**
 * Formats a value as USD and always shows exactly 2 decimal places.
 *
 * @example
 * formatUsdFixed(9.9)   // "$9.90"
 * formatUsdFixed(100)   // "$100.00"
 */
export function formatUsdFixed(value: number): string {
  return formatUsd(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Formats a large USD value in compact notation (e.g. $1.2M, $500K).
 *
 * @example
 * formatUsdCompact(1_200_000) // "$1.2M"
 * formatUsdCompact(500_000)   // "$500K"
 */
export function formatUsdCompact(value: number): string {
  return formatUsd(value, {
    notation: "compact",
    maximumFractionDigits: 1,
  })
}
