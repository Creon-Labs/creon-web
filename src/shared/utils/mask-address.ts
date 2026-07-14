/**
 * Masks a wallet address by showing only the first and last N characters.
 *
 * @param address   - The full wallet address to mask.
 * @param digit     - Number of characters to show at the start (and at the end
 *                    if `lastDigit` is omitted). Defaults to `4`.
 * @param lastDigit - Number of characters to show at the end. When omitted,
 *                    `digit` is used for both sides.
 *
 * @example
 * maskAddress('GBXUP4OGAH3HCCCBRYRX3RKB5LQGOPL3TCLOIS7S7O2J43PV56ZUDOEK')
 * // → 'GBXU...DOEK'
 *
 * maskAddress('GBXUP4OGAH3HCCCBRYRX3RKB5LQGOPL3TCLOIS7S7O2J43PV56ZUDOEK', 6)
 * // → 'GBXUP4...UDOEK'
 *
 * maskAddress('GBXUP4OGAH3HCCCBRYRX3RKB5LQGOPL3TCLOIS7S7O2J43PV56ZUDOEK', 6, 8)
 * // → 'GBXUP4...56ZUDOEK'
 */
export function maskAddress(
  address: string,
  digit: number = 4,
  lastDigit?: number
): string {
  const tail = lastDigit ?? digit

  if (address.length <= digit + tail) {
    return address
  }

  return `${address.slice(0, digit)}...${address.slice(-tail)}`
}
