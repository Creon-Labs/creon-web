export type { RegisterFormProps, WalletInfo } from "./components/register-form"
export { RegisterForm } from "./components/register-form"

export type { RegisterFormValues } from "./schemas/register.schema"
export { registerSchema } from "./schemas/register.schema"

export type { RegisterPayload, UserRole } from "./types/register.types"

export { createAuthNonce, useCreateAuthNonce } from "./api/create-auth-nonce"
export { login, useLogin } from "./api/login"
export type { LoginResponse } from "./api/login"
export type { AuthRole } from "./types/login.types"

export { register, useRegister } from "./api/register"

export { logout, useLogout } from "./api/logout"

export {
  authMe,
  authMeQueryKey,
  authMeQueryOptions,
  useAuthMe,
} from "./api/auth-me"
export type { UserProfile } from "./types/auth-me.types"

export {
  completeWalletChallenge,
  isExpiredOrUsedChallengeError,
} from "./utils/wallet-challenge"
export type { SignChallengeMessage } from "./utils/wallet-challenge"
