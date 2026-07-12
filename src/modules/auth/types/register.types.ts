export type UserRole = "ENTREPRENEUR" | "INVESTOR"

export type RegisterFormValues = {
  role: UserRole
  displayName: string
  email?: string
}

/**
 * Injected from upstream (wallet connect + sign flow).
 * The form itself doesn't collect these; they come from the auth flow.
 */
export type RegisterPayload = RegisterFormValues & {
  walletAddress: string
  signature: string
}
