import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"

import { AdminKycRevokeResponse } from "../types"

// -------------------------
// API function
// -------------------------

export type RevokeKycInput = {
  userId: string
  reason: string
}

export const revokeKyc = async ({
  userId,
  reason,
}: RevokeKycInput): Promise<AdminKycRevokeResponse> => {
  return api
    .post<ApiResponse<AdminKycRevokeResponse>>(`/admin/kyc/${userId}/revoke`, {
      reason,
    })
    .then((res) => res.data)
}

// -------------------------
// Mutation hook
// -------------------------

type UseRevokeKycOptions = {
  config?: MutationConfig<typeof revokeKyc>
}

export const useRevokeKyc = ({ config }: UseRevokeKycOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: revokeKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] })
    },
    ...config,
  })
}
