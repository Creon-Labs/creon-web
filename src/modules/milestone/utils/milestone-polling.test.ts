import { describe, expect, it } from "vitest"

import type { MilestoneStatus } from "../types"
import { getMilestonePollingInterval } from "./milestone-polling"

describe("getMilestonePollingInterval", () => {
  it.each<MilestoneStatus>(["VOTING", "APPROVED", "RELEASING"])(
    "polls while the milestone status is %s",
    (status) => {
      expect(getMilestonePollingInterval(status)).toBe(10_000)
    }
  )

  it.each<MilestoneStatus>([
    "DRAFT",
    "PENDING",
    "RELEASED",
    "REJECTED",
    "FAILED",
  ])("does not poll when the milestone status is %s", (status) => {
    expect(getMilestonePollingInterval(status)).toBe(false)
  })

  it("does not start an interval before milestone data is available", () => {
    expect(getMilestonePollingInterval(undefined)).toBe(false)
  })
})
