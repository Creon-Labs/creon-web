import { describe, expect, it } from "vitest"
import { getDistributionDepositErrorMessage } from "./distribution-error"

describe("getDistributionDepositErrorMessage", () => {
  it("gives an actionable USDC trustline instruction", () => {
    expect(
      getDistributionDepositErrorMessage(new Error("Missing USDC trustline"))
    ).toContain("trustline")
  })

  it("gives an actionable insufficient-balance instruction", () => {
    expect(
      getDistributionDepositErrorMessage(new Error("tx_insufficient_balance"))
    ).toContain("enough USDC")
  })

  it("maps a campaign conflict without relying on backend message text", () => {
    expect(
      getDistributionDepositErrorMessage(
        Object.assign(new Error("Conflict"), { statusCode: 409 })
      )
    ).toContain("not ready")
  })
})
