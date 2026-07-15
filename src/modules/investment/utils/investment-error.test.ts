import { describe, expect, it } from "vitest"

import { getInvestmentErrorCopy } from "./investment-error"

describe("investment error copy", () => {
  it("separates campaign readiness errors", () => {
    const error = new Error("Investment opens after deployment is live")
    error.name = "CampaignInvestmentUnavailableError"

    expect(getInvestmentErrorCopy(error).kind).toBe("CAMPAIGN")
  })

  it.each([
    ["wallet is not whitelisted", "WHITELIST"],
    ["HostError: Error(Contract, #1)", "WHITELIST"],
    ["op_no_trust", "TRUSTLINE"],
    ["insufficient USDC balance", "BALANCE"],
  ] as const)("maps %s to %s guidance", (message, kind) => {
    expect(getInvestmentErrorCopy(new Error(message)).kind).toBe(kind)
  })

  it("keeps the whitelist classification after friendly copy is added", () => {
    const error = new Error(
      "Verifikasi disetujui, tetapi akses investasi sedang disinkronkan."
    )
    error.name = "InvestmentWhitelistSyncError"

    expect(getInvestmentErrorCopy(error).kind).toBe("WHITELIST")
  })

  it("recognizes the backend campaign conflict", () => {
    const error = Object.assign(
      new Error("Campaign is not open for investment"),
      { statusCode: 409 }
    )

    expect(getInvestmentErrorCopy(error).kind).toBe("CAMPAIGN")
  })
})
