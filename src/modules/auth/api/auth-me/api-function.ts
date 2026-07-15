import { cache } from "react"
import { UserProfile } from "../../types/auth-me.types"
import { api, ApiResponse } from "@/shared/lib/api-client"

export const authMe = cache(async (): Promise<UserProfile> => {
  const res = await api.get<ApiResponse<UserProfile>>("/auth/me")
  return res.data
})
