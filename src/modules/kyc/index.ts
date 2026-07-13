// Components
export type { KycFormProps } from "./components/kyc-form"
export { KycForm } from "./components/kyc-form"
export { KycStatusAlert } from "./components/kyc-status-alert"

// Schemas
export { kycSchema } from "./schemas/kyc.schema"

// Types
export type {
  KycFormValues,
  KycStatus,
  KycProfile,
  KycSubmitResponse,
} from "./types"

// API — submit KYC
export type { SubmitKycPayload } from "./api/submit-kyc"
export { submitKyc, useSubmitKyc } from "./api/submit-kyc"

// API — get KYC status
export {
  getMyKycStatus,
  getMyKycStatusQueryOptions,
  useGetMyKycStatus,
} from "./api/get-kyc-status"
