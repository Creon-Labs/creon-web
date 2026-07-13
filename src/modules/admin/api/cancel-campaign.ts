import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"

import { AdminCancelCampaignResponse } from "../types"

// -------------------------
// API function
// -------------------------

export type CancelCampaignInput = {
  id: string
  reason: string
}

export const cancelCampaign = async ({
  id,
  reason,
}: CancelCampaignInput): Promise<AdminCancelCampaignResponse> => {
  return api
    .post<{ data: AdminCancelCampaignResponse }>(
      `/admin/campaigns/${id}/cancel`,
      { reason }
    )
    .then((res) => res.data)
}

// -------------------------
// Mutation hook
// -------------------------

type UseCancelCampaignOptions = {
  config?: MutationConfig<typeof cancelCampaign>
}

export const useCancelCampaign = ({
  config,
}: UseCancelCampaignOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelCampaign,
    onSuccess: (data) => {
      // Invalidate both proposal list and the specific campaign cache
      queryClient.invalidateQueries({ queryKey: ["admin", "proposals"] })
      queryClient.invalidateQueries({
        queryKey: ["campaigns", data.campaignId],
      })
    },
    ...config,
  })
}
