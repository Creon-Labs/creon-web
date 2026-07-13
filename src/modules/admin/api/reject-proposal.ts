import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"

import { AdminRejectProposalResponse } from "../types"

// -------------------------
// API function
// -------------------------

export type RejectProposalInput = {
  id: string
  reason: string
}

export const rejectProposal = async ({
  id,
  reason,
}: RejectProposalInput): Promise<AdminRejectProposalResponse> => {
  return api
    .post<{ data: AdminRejectProposalResponse }>(
      `/admin/proposals/${id}/reject`,
      { reason }
    )
    .then((res) => res.data)
}

// -------------------------
// Mutation hook
// -------------------------

type UseRejectProposalOptions = {
  config?: MutationConfig<typeof rejectProposal>
}

export const useRejectProposal = ({
  config,
}: UseRejectProposalOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "proposals"] })
    },
    ...config,
  })
}
