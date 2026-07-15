import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { useMutation } from "@tanstack/react-query"

type AuthNonceResponse = ApiResponse<{
  message: string
}>

const createAuthNonce = async (walletAddress: string): Promise<string> => {
  const res = await api.post<AuthNonceResponse>("/auth/challenge", {
    walletAddress,
  })

  return res.data.message
}

type UseCreateAuthNonceOptions = {
  config?: MutationConfig<typeof createAuthNonce>
}

const useCreateAuthNonce = ({ config }: UseCreateAuthNonceOptions = {}) => {
  return useMutation({
    mutationFn: createAuthNonce,
    ...config,
  })
}

export { useCreateAuthNonce, createAuthNonce }
