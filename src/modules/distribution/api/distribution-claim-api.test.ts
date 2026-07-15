import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/shared/lib/api-client", () => ({
  api: {
    post: vi.fn(),
  },
}))

import { api } from "@/shared/lib/api-client"
import { prepareDistributionClaim } from "./prepare-distribution-claim"
import { submitDistributionClaim } from "./submit-distribution-claim"

const mockedPost = vi.mocked(api.post)

describe("distribution claim API", () => {
  beforeEach(() => {
    mockedPost.mockReset()
  })

  it("requests an unsigned claim XDR for the selected distribution", async () => {
    const response = {
      statusCode: 200,
      message: "Claim transaction prepared",
      data: {
        distributionId: "distribution-1",
        xdr: "prepared-xdr",
      },
    }
    mockedPost.mockResolvedValue(response as never)

    await expect(
      prepareDistributionClaim({ distributionId: "distribution-1" })
    ).resolves.toEqual(response.data)
    expect(mockedPost).toHaveBeenCalledWith(
      "/distributions/distribution-1/claim/prepare"
    )
  })

  it("submits only the signed XDR and unwraps the claimed entitlement", async () => {
    const response = {
      statusCode: 201,
      message: "Claimed",
      data: {
        id: "claim-1",
        distributionId: "distribution-1",
        shareAmount: "10.0000000",
        amount: "5.0000000",
        leafIndex: 0,
        merkleProof: [],
        claimTxHash: "a".repeat(64),
        status: "CLAIMED" as const,
        claimedAt: "2026-07-15T00:00:00.000Z",
        createdAt: "2026-07-15T00:00:00.000Z",
      },
    }
    mockedPost.mockResolvedValue(response as never)

    await expect(
      submitDistributionClaim({
        distributionId: "distribution-1",
        signedXdr: "wallet-signed-xdr",
      })
    ).resolves.toEqual(response.data)
    expect(mockedPost).toHaveBeenCalledWith(
      "/distributions/distribution-1/claim",
      { signedXdr: "wallet-signed-xdr" }
    )
  })
})
