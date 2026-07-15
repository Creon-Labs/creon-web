import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"

import { AdminApproveProposalResponse } from "../types"

// -------------------------
// API function
// -------------------------

export type ApproveProposalInput = {
  id: string
}

export const approveProposal = async ({
  id,
}: ApproveProposalInput): Promise<AdminApproveProposalResponse> => {
  return api
    .post<ApiResponse<AdminApproveProposalResponse>>(
      `/admin/proposals/${id}/approve`
    )
    .then((res) => res.data)
}

// -------------------------
// Mutation hook
// -------------------------

type UseApproveProposalOptions = {
  config?: MutationConfig<typeof approveProposal>
}

export const useApproveProposal = ({
  config,
}: UseApproveProposalOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "proposals"] })
    },
    ...config,
  })
}
