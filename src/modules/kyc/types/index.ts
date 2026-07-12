// ---------------------------------------------------------------------------
// Form types (used by KycForm component)
// ---------------------------------------------------------------------------

export type KycFormValues = {
  fullName: string
  nationalId: string
  dateOfBirth?: string
  idCard: string | null
  selfie: string | null
}

// ---------------------------------------------------------------------------
// API types (mirrors OpenAPI schemas)
// ---------------------------------------------------------------------------

/** KYC verification status enum */
export type KycStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVOKED"

/**
 * Full KYC profile returned by `GET /kyc/me`.
 * `reviewedAt` and `rejectionReason` are nullable — only populated after admin
 * review.
 */
export type KycProfile = {
  status: KycStatus
  fullName: string
  /** Indonesian NIK — 16 digits */
  nationalId: string
  submittedAt: string
  reviewedAt: string | null
  rejectionReason: string | null
}

/**
 * Minimal response returned by `POST /kyc`.
 * The status will always be `PENDING` immediately after submission.
 */
export type KycSubmitResponse = {
  status: KycStatus
  submittedAt: string
}

