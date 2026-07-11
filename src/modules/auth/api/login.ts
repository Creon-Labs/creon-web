import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { useMutation } from "@tanstack/react-query"

type AuthRole = "ENTREPRENEUR" | "INVESTOR" | "ADMIN"

type AuthPrincipalResponse = {
  userId: string
  roles: AuthRole[]
}

export type LoginPayload = {
  walletAddress: string
  signature: string
}

export type LoginResponse = ApiResponse<AuthPrincipalResponse>

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/auth/login", data)

    return res
  } catch (error) {
    throw error
  }
}

type UseLoginOptions = {
  config?: MutationConfig<typeof login>
}

export const useLogin = ({ config }: UseLoginOptions = {}) => {
  return useMutation({
    mutationFn: login,
    ...config,
  })
}
