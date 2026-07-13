import { AuthRole } from "./login.types"

export type UserProfile = {
  id: string
  walletAddress: string
  email: string | null
  displayName: string | null
  roles: AuthRole[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}
