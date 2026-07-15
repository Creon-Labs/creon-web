import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/shared/lib/api-client", () => ({
  api: {
    post: vi.fn(),
  },
}))

import { api } from "@/shared/lib/api-client"
import { claimUsdc } from "./claim-usdc"
import { prepareUsdcTrustline } from "./prepare-usdc-trustline"
import { submitUsdcTrustline } from "./submit-usdc-trustline"

const mockedPost = vi.mocked(api.post)
const walletAddress = `G${"A".repeat(55)}`

describe("faucet API", () => {
  beforeEach(() => {
    mockedPost.mockReset()
  })

  it("prepares a trustline without sending credentials", async () => {
    const response = {
      statusCode: 200,
      message: "Trustline transaction prepared",
      data: { xdr: "unsigned-change-trust-xdr" },
    }
    mockedPost.mockResolvedValue(response as never)

    await expect(prepareUsdcTrustline({ walletAddress })).resolves.toEqual(
      response.data
    )
    expect(mockedPost).toHaveBeenCalledWith(
      "/faucet/usdc/trustline/prepare",
      { walletAddress },
      { credentials: "omit" }
    )
  })

  it("submits the exact wallet-signed trustline XDR publicly", async () => {
    const response = {
      statusCode: 201,
      message: "Trustline established",
      data: { txHash: "trustline-tx" },
    }
    mockedPost.mockResolvedValue(response as never)

    await expect(
      submitUsdcTrustline({
        walletAddress,
        signedXdr: "signed-change-trust-xdr",
      })
    ).resolves.toEqual(response.data)
    expect(mockedPost).toHaveBeenCalledWith(
      "/faucet/usdc/trustline/submit",
      { walletAddress, signedXdr: "signed-change-trust-xdr" },
      { credentials: "omit" }
    )
  })

  it("claims USDC with only the wallet address and no signature", async () => {
    const response = {
      statusCode: 201,
      message: "USDC claimed",
      data: {
        txHash: "claim-tx",
        amount: "1000",
        walletAddress,
      },
    }
    mockedPost.mockResolvedValue(response as never)

    await expect(claimUsdc({ walletAddress })).resolves.toEqual(response.data)
    expect(mockedPost).toHaveBeenCalledWith(
      "/faucet/usdc/claim",
      { walletAddress },
      { credentials: "omit" }
    )
  })
})
