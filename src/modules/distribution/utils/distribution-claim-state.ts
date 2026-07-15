import type { DistributionClaim } from "../types"

export type DistributionClaimActionState =
  "CLAIMABLE" | "PROCESSING_DISTRIBUTION" | "CLAIMED" | "FAILED" | "UNAVAILABLE"

export function getDistributionClaimActionState(
  claim: Pick<DistributionClaim, "status" | "distribution">
): DistributionClaimActionState {
  if (claim.status === "CLAIMED") return "CLAIMED"
  if (claim.status === "FAILED") return "FAILED"
  if (claim.distribution?.status === "PENDING") {
    return "PROCESSING_DISTRIBUTION"
  }
  if (
    claim.status === "PENDING" &&
    claim.distribution?.status === "COMPLETED"
  ) {
    return "CLAIMABLE"
  }

  return "UNAVAILABLE"
}

export function getDistributionClaimErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Klaim dividen gagal. Silakan coba lagi."
  }

  if ("statusCode" in error && error.statusCode === 401) {
    return "Sesi Anda telah berakhir. Silakan masuk kembali sebelum mengklaim dividen."
  }

  if ("statusCode" in error && error.statusCode === 403) {
    return "Klaim dividen memerlukan akun investor dengan KYC yang sudah disetujui."
  }

  if ("statusCode" in error && error.statusCode === 409) {
    return "Dividen belum siap diklaim atau sudah diklaim sebelumnya. Muat ulang data Anda."
  }

  return error.message || "Klaim dividen gagal. Silakan coba lagi."
}
