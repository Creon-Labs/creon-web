import { describe, expect, it } from "vitest"

import {
  getDomainStatusCopy,
  getDomainStatusPollingInterval,
  isDomainStatusTerminal,
} from "./domain-status"

describe("domain status helpers", () => {
  it("polls only non-terminal asynchronous statuses", () => {
    expect(getDomainStatusPollingInterval("distribution", "PENDING")).toBe(
      10_000
    )
    expect(getDomainStatusPollingInterval("distribution", "COMPLETED")).toBe(
      false
    )
    expect(getDomainStatusPollingInterval("kyc", "REJECTED")).toBe(false)
  })

  it("provides one status copy and badge treatment for each domain", () => {
    expect(getDomainStatusCopy("refund", "PENDING").label).toBe(
      "Refund sedang diproses"
    )
    expect(getDomainStatusCopy("milestone", "VOTING").description).toContain(
      "Investor voting"
    )
    expect(isDomainStatusTerminal("campaignDeployment", "LIVE")).toBe(true)
  })
})
