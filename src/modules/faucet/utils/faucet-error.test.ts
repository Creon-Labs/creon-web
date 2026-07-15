import { describe, expect, it } from "vitest"

import { getFaucetErrorInfo } from "./faucet-error"

function apiError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode })
}

describe("faucet error mapping", () => {
  it("turns an inactive account response into Friendbot guidance", () => {
    const error = apiError(
      "Wallet not found on-chain; fund it with testnet XLM via friendbot first",
      400
    )

    expect(getFaucetErrorInfo(error, "TRUSTLINE")).toMatchObject({
      kind: "ACCOUNT_INACTIVE",
      title: "Wallet is not active on Stellar testnet",
    })
  })

  it("shows the documented default wait for a claim cooldown", () => {
    const error = apiError(
      "USDC already claimed for this wallet; try again later",
      409
    )

    const info = getFaucetErrorInfo(error, "CLAIM")
    expect(info.kind).toBe("COOLDOWN")
    expect(info.description).toContain("24 hours")
    expect(info.description).toContain("exact remaining time")
  })

  it("returns the user to trustline setup when claim finds no trustline", () => {
    const error = apiError("Wallet has no USDC trustline yet", 400)

    expect(getFaucetErrorInfo(error, "CLAIM").kind).toBe("TRUSTLINE_REQUIRED")
  })
})
