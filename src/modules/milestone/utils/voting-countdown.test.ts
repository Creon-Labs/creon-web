import { describe, expect, it } from "vitest"

import { getVotingCountdown } from "./voting-countdown"

const NOW = new Date("2026-07-15T00:00:00.000Z").getTime()

describe("getVotingCountdown", () => {
  it("formats a voting window longer than one day", () => {
    expect(getVotingCountdown("2026-07-17T03:04:00.000Z", NOW)).toEqual({
      isOpen: true,
      label: "2d 3h 4m",
    })
  })

  it("includes seconds when less than one day remains", () => {
    expect(getVotingCountdown("2026-07-15T02:04:09.000Z", NOW)).toEqual({
      isOpen: true,
      label: "2h 4m 9s",
    })
  })

  it("closes voting at the exact deadline", () => {
    expect(getVotingCountdown("2026-07-15T00:00:00.000Z", NOW)).toEqual({
      isOpen: false,
      label: "Voting has ended",
    })
  })

  it("handles a missing deadline", () => {
    expect(getVotingCountdown(null, NOW)).toEqual({
      isOpen: false,
      label: "No deadline available",
    })
  })
})
