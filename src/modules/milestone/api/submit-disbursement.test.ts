import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/shared/lib/api-client", () => ({
  api: {
    post: vi.fn(),
  },
}))

import { api } from "@/shared/lib/api-client"
import { submitDisbursement } from "./submit-disbursement"

const mockedPost = vi.mocked(api.post)

describe("submit milestone proof API", () => {
  beforeEach(() => {
    mockedPost.mockReset()
  })

  it("unwraps the submitted milestone from the response envelope", async () => {
    const proof = new File(["proof"], "proof.pdf", {
      type: "application/pdf",
    })
    const response = {
      statusCode: 201,
      message: "Milestone submitted",
      data: {
        id: "milestone-1",
        campaignId: "campaign-1",
        order: 1,
        onchainIndex: 0,
        title: "First milestone",
        description: "Open the first location",
        amount: "1000.0000000",
        status: "VOTING" as const,
        votingStartedAt: "2026-07-15T00:00:00.000Z",
        votingEndsAt: "2026-07-22T00:00:00.000Z",
        releaseTxHash: null,
      },
    }
    mockedPost.mockResolvedValue(response as never)

    await expect(
      submitDisbursement({ milestoneId: "milestone-1", proof })
    ).resolves.toEqual(response.data)

    const [url, body] = mockedPost.mock.calls[0]
    expect(url).toBe("/milestones/milestone-1/submit")
    expect(body).toBeInstanceOf(FormData)
    expect((body as FormData).get("proof")).toEqual(proof)
  })
})
