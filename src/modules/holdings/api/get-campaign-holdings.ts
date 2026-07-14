import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"

import { CampaignHolding } from "../types"

// ─── API Function ─────────────────────────────────────────────────────────────

export type GetCampaignHoldingsInput = {
  /** UUID of the campaign */
  campaignId: string
}

/**
 * Fetches the masked cap table (Daftar Pemegang Saham) for a campaign.
 *
 * Endpoint: `GET /campaigns/{id}/holdings`
 *
 * Public — no authentication required.
 * Holder identity is masked (truncated wallet address, display name reduced to
 * initials) so no sensitive data is exposed.
 */
export const getCampaignHoldings = ({
  campaignId,
}: GetCampaignHoldingsInput): Promise<CampaignHolding[]> => {
  return api.get<CampaignHolding[]>(`/campaigns/${campaignId}/holdings`)
}

// ─── Query Options ────────────────────────────────────────────────────────────

export const getCampaignHoldingsQueryOptions = ({
  campaignId,
}: GetCampaignHoldingsInput) => ({
  queryKey: ["campaigns", campaignId, "holdings"],
  queryFn: () => getCampaignHoldings({ campaignId }),
})

// ─── Hook ─────────────────────────────────────────────────────────────────────

type UseGetCampaignHoldingsOptions = GetCampaignHoldingsInput & {
  config?: QueryConfig<typeof getCampaignHoldingsQueryOptions>
}

/**
 * React hook to fetch the masked cap table for a campaign.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetCampaignHoldings({ campaignId: "uuid" })
 * ```
 */
export const useGetCampaignHoldings = ({
  campaignId,
  config,
}: UseGetCampaignHoldingsOptions) => {
  return useQuery({
    ...getCampaignHoldingsQueryOptions({ campaignId }),
    ...config,
  })
}
