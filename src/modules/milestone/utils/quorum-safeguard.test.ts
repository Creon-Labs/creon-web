import { describe, expect, it } from "vitest"

import { getQuorumSafeguardCopy } from "./quorum-safeguard"

describe("getQuorumSafeguardCopy", () => {
  it("explains the extension and default approval before quorum is reached", () => {
    expect(
      getQuorumSafeguardCopy({ quorumBps: 3000, quorumMet: false })
    ).toEqual({
      title: "Quorum has not been reached yet",
      description:
        "If participation remains below the 30% quorum at this deadline, voting will extend automatically once. If quorum is still missing when that extended window ends, the milestone will be approved automatically so passive investors cannot block the release indefinitely.",
    })
  })

  it("warns that an extended window can end in automatic approval", () => {
    expect(
      getQuorumSafeguardCopy({
        quorumBps: 3000,
        quorumMet: false,
        votingExtended: true,
      })
    ).toMatchObject({
      title: "One-time voting extension is active",
      description: expect.stringContaining(
        "the milestone will be approved automatically"
      ),
    })
  })

  it("explains the safeguard even when the original window has quorum", () => {
    expect(
      getQuorumSafeguardCopy({ quorumBps: 3000, quorumMet: true })
    ).toMatchObject({
      title: "Quorum has been reached",
      description: expect.stringContaining(
        "only another quorum miss at the extended deadline"
      ),
    })
  })

  it("uses the approval threshold after an extended window reaches quorum", () => {
    expect(
      getQuorumSafeguardCopy({
        quorumBps: 3000,
        quorumMet: true,
        votingExtended: true,
      })
    ).toMatchObject({
      title: "Extended voting has reached quorum",
      description: expect.stringContaining(
        "The approval threshold will determine the result"
      ),
    })
  })
})
