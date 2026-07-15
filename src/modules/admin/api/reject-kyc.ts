import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"

import { AdminKycRejectResponse } from "../types"

// -------------------------
// API function
// -------------------------

export type RejectKycInput = {
  userId: string
  reason: string
}

export const rejectKyc = async ({
  userId,
  reason,
}: RejectKycInput): Promise<AdminKycRejectResponse> => {
  return api
    .post<ApiResponse<AdminKycRejectResponse>>(`/admin/kyc/${userId}/reject`, {
      reason,
    })
    .then((res) => res.data)
}

// -------------------------
// Mutation hook
// -------------------------

type UseRejectKycOptions = {
  config?: MutationConfig<typeof rejectKyc>
}

export const useRejectKyc = ({ config }: UseRejectKycOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] })
    },
    ...config,
  })
}
