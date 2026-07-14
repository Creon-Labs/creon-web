import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query/query-config"
import { Proposal } from "../types"

// --- API function ---

export type UploadProposalMediaInput = {
  id: string
  images?: File[]
  documents?: File[]
}

export const uploadProposalMedia = async ({
  id,
  images,
  documents,
}: UploadProposalMediaInput) => {
  const formData = new FormData()

  if (images && images.length > 0) {
    images.forEach((file) => formData.append("images", file))
  }

  if (documents && documents.length > 0) {
    documents.forEach((file) => formData.append("documents", file))
  }

  const res = await api.post<ApiResponse<Proposal>>(
    `/proposals/${id}/media`,
    formData
  )
  return res.data!
}

// --- Hook ---

type UseUploadProposalMediaOptions = {
  config?: MutationConfig<typeof uploadProposalMedia>
}

export const useUploadProposalMedia = ({
  config,
}: UseUploadProposalMediaOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadProposalMedia,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
      queryClient.invalidateQueries({ queryKey: ["proposals", id] })
    },
    ...config,
  })
}
