import { describe, expect, it } from "vitest"

import { formatUsdcAmount } from "./format-usdc"

describe("formatUsdcAmount", () => {
  it("formats decimal strings without converting them to JavaScript numbers", () => {
    expect(formatUsdcAmount("0012345.6700000")).toBe("12,345.67")
    expect(formatUsdcAmount("1000.0000000")).toBe("1,000")
    expect(formatUsdcAmount("0.0000001")).toBe("0.0000001")
  })

  it("leaves unexpected API values visible for diagnosis", () => {
    expect(formatUsdcAmount("not-an-amount")).toBe("not-an-amount")
  })
})
