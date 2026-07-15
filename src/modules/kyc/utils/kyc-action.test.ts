import { describe, expect, it } from "vitest"

import {
  assertKycApproved,
  DUPLICATE_NIK_MESSAGE,
  getKycPollingInterval,
  getKycSubmissionErrorMessage,
  isWhitelistSyncError,
  KycApprovalRequiredError,
} from "./kyc-action"

describe("KYC action helpers", () => {
  it("maps the backend duplicate-NIK conflict to actionable copy", () => {
    const error = Object.assign(new Error("National ID already registered"), {
      statusCode: 409,
    })

    expect(getKycSubmissionErrorMessage(error)).toBe(DUPLICATE_NIK_MESSAGE)
  })

  it("preserves other KYC conflicts", () => {
    const error = Object.assign(
      new Error("KYC already submitted, pending review"),
      { statusCode: 409 }
    )

    expect(getKycSubmissionErrorMessage(error)).toBe(error.message)
  })

  it("blocks protected actions without approved KYC", () => {
    expect(() => assertKycApproved(undefined)).toThrow(KycApprovalRequiredError)
    expect(() => assertKycApproved({ status: "REVOKED" } as never)).toThrow(
      KycApprovalRequiredError
    )
    expect(() =>
      assertKycApproved({ status: "APPROVED" } as never)
    ).not.toThrow()
  })

  it("polls only while the KYC profile is pending", () => {
    expect(getKycPollingInterval("PENDING")).toBe(15_000)
    expect(getKycPollingInterval("APPROVED")).toBe(false)
    expect(getKycPollingInterval("REJECTED")).toBe(false)
    expect(getKycPollingInterval("REVOKED")).toBe(false)
  })

  it("identifies the on-chain whitelist rejection", () => {
    expect(isWhitelistSyncError(new Error("wallet is not whitelisted"))).toBe(
      true
    )
    expect(isWhitelistSyncError(new Error("insufficient USDC balance"))).toBe(
      false
    )
  })
})
