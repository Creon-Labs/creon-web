import type { KycProfile, KycStatus } from "../types"

export const DUPLICATE_NIK_MESSAGE =
  "NIK ini sudah digunakan untuk memverifikasi akun lain."

export const KYC_REQUIRED_MESSAGE =
  "Verifikasi identitas Anda terlebih dahulu sebelum melanjutkan."

export const WHITELIST_SYNC_MESSAGE =
  "Verifikasi Anda sudah disetujui, tetapi akses investasi sedang disinkronkan. Silakan coba lagi dalam beberapa saat."

export class KycApprovalRequiredError extends Error {
  constructor() {
    super(KYC_REQUIRED_MESSAGE)
    this.name = "KycApprovalRequiredError"
  }
}

function isApiErrorWithStatus(
  error: unknown,
  statusCode: number
): error is Error & { statusCode: number } {
  return (
    error instanceof Error &&
    "statusCode" in error &&
    error.statusCode === statusCode
  )
}

export function assertKycApproved(profile: KycProfile | undefined): void {
  if (profile?.status !== "APPROVED") {
    throw new KycApprovalRequiredError()
  }
}

export function getKycPollingInterval(
  status: KycStatus | undefined
): number | false {
  return status === "PENDING" ? 15_000 : false
}

export function getKycSubmissionErrorMessage(error: unknown): string {
  if (
    isApiErrorWithStatus(error, 409) &&
    error.message === "National ID already registered"
  ) {
    return DUPLICATE_NIK_MESSAGE
  }

  if (error instanceof Error) return error.message

  return "Terjadi kesalahan. Silakan coba lagi."
}

export function isWhitelistSyncError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  return /whitelist|not[_ -]?whitelisted/i.test(error.message)
}
