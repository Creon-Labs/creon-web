const DECIMAL_AMOUNT_PATTERN = /^\d+(?:\.\d{1,7})?$/

export function formatUsdcAmount(value: string): string {
  if (!DECIMAL_AMOUNT_PATTERN.test(value)) return value

  const [integerPart, fractionPart = ""] = value.split(".")
  const normalizedInteger = integerPart.replace(/^0+(?=\d)/, "")
  const groupedInteger = normalizedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const normalizedFraction = fractionPart.replace(/0+$/, "")

  return normalizedFraction
    ? `${groupedInteger}.${normalizedFraction}`
    : groupedInteger
}
