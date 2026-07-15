import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"

import { AdminKycApproveResponse } from "../types"

// -------------------------
// API function
// -------------------------

export type ApproveKycInput = {
  userId: string
}

export const approveKyc = async ({
  userId,
}: ApproveKycInput): Promise<AdminKycApproveResponse> => {
  return api
    .post<ApiResponse<AdminKycApproveResponse>>(`/admin/kyc/${userId}/approve`)
    .then((res) => res.data)
}

// -------------------------
// Mutation hook
// -------------------------

type UseApproveKycOptions = {
  config?: MutationConfig<typeof approveKyc>
}

export const useApproveKyc = ({ config }: UseApproveKycOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] })
    },
    ...config,
  })
}
