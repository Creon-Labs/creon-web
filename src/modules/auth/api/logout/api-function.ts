import { api } from "@/shared/lib/api-client"

export const logout = async (): Promise<void> => {
  try {
    await api.post<void>("/auth/logout")
  } catch (err) {
    if (err instanceof SyntaxError) return
    throw err
  }
}
