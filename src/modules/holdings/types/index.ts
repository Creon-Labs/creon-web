/**
 * One row of a campaign's public cap table (Daftar Pemegang Saham).
 *
 * Holder identity is masked: wallet address is truncated and any display
 * name is reduced to initials. Legal KYC names are never exposed.
 *
 * @see GET /campaigns/{id}/holdings
 */
export type CampaignHolding = {
  /** Holder's masked display name (e.g. `B*** S***`), or `null` for an
   *  unregistered on-chain address or a holder with no display name. */
  holder: string | null

  /** Masked wallet address — first 4 and last 4 characters (e.g. `GCUQ…OCBY`) */
  address: string

  /** Current share balance as a decimal string (7 decimals, e.g. `"500.0000000"`) */
  balance: string

  /** Stellar ledger sequence at which this balance was last synced */
  updatedLedger: number
}
