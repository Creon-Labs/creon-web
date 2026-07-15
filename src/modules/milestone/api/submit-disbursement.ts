import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { Milestone } from "../types"

export type SubmitDisbursementInput = {
  milestoneId: string
  proof: File
}

export const submitDisbursement = ({
  milestoneId,
  proof,
}: SubmitDisbursementInput): Promise<Milestone> => {
  const formData = new FormData()
  formData.append("proof", proof)

  return api
    .post<ApiResponse<Milestone>>(`/milestones/${milestoneId}/submit`, formData)
    .then((response) => response.data)
}

type UseSubmitDisbursementOptions = {
  config?: MutationConfig<typeof submitDisbursement>
}

export const useSubmitDisbursement = ({
  config,
}: UseSubmitDisbursementOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitDisbursement,
    onSuccess: (...args) => {
      const data = args[0]
      // Invalidate both the detail view of this milestone and the list of milestones for this campaign
      queryClient.invalidateQueries({
        queryKey: ["milestone", data.id],
      })
      queryClient.invalidateQueries({
        queryKey: ["milestones", data.campaignId],
      })

      if (config?.onSuccess) {
        config.onSuccess(...args)
      }
    },
    ...config,
  })
}
