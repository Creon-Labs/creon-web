import { beforeEach, describe, expect, it, vi } from "vitest"

import type { Investment, PrepareInvestmentInput } from "../types"

const queryClient = vi.hoisted(() => ({
  invalidateQueries: vi.fn(),
}))
const wallet = vi.hoisted(() => ({
  signTransaction: vi.fn(),
}))
const kyc = vi.hoisted(() => ({
  assertKycApproved: vi.fn(),
  getMyKycStatus: vi.fn(),
  isWhitelistSyncError: vi.fn(() => false),
  WHITELIST_SYNC_MESSAGE: "Whitelist is synchronizing",
}))
const campaign = vi.hoisted(() => ({
  assertCampaignCanAcceptInvestments: vi.fn(),
  getCampaignById: vi.fn(),
}))
const relay = vi.hoisted(() => ({
  prepareInvestment: vi.fn(),
  submitInvestment: vi.fn(),
}))

vi.mock("react", () => ({
  useState: vi.fn(() => ["IDLE", vi.fn()]),
}))

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({})),
  useQueryClient: vi.fn(() => queryClient),
}))

vi.mock("@/shared/lib/stellar-wallet", () => ({
  useStellarWallet: vi.fn(() => wallet),
}))

vi.mock("@/modules/kyc", () => kyc)
vi.mock("@/modules/campaign", () => campaign)
vi.mock("./prepare-investment", () => ({
  prepareInvestment: relay.prepareInvestment,
}))
vi.mock("./submit-investment", () => ({
  submitInvestment: relay.submitInvestment,
}))

import { useMutation } from "@tanstack/react-query"
import { useInvest } from "./use-invest"

const mockedUseMutation = vi.mocked(useMutation)

type InvestMutationOptions = {
  mutationFn: (input: PrepareInvestmentInput) => Promise<Investment>
}

function getMutationOptions(): InvestMutationOptions {
  const options = mockedUseMutation.mock.calls[0]?.[0]
  if (!options || typeof options.mutationFn !== "function") {
    throw new Error("Investment mutation was not configured")
  }

  return options as InvestMutationOptions
}

const confirmedInvestment: Investment = {
  id: "investment-1",
  campaignId: "campaign-1",
  amount: "10.0000000",
  lpTokens: "10.0000000",
  txHash: "tx-hash",
  status: "CONFIRMED",
  investedAt: "2026-07-15T00:00:00.000Z",
  createdAt: "2026-07-15T00:00:00.000Z",
}

describe("useInvest", () => {
  beforeEach(() => {
    mockedUseMutation.mockClear()
    queryClient.invalidateQueries.mockReset()
    wallet.signTransaction.mockReset()
    kyc.assertKycApproved.mockReset()
    kyc.getMyKycStatus.mockReset()
    kyc.isWhitelistSyncError.mockReset()
    kyc.isWhitelistSyncError.mockReturnValue(false)
    campaign.assertCampaignCanAcceptInvestments.mockReset()
    campaign.getCampaignById.mockReset()
    relay.prepareInvestment.mockReset()
    relay.submitInvestment.mockReset()

    kyc.getMyKycStatus.mockResolvedValue({ status: "APPROVED" })
    campaign.getCampaignById.mockResolvedValue({
      id: "campaign-1",
      deployStatus: "LIVE",
      status: "ACTIVE",
    })
    relay.prepareInvestment.mockResolvedValue({
      campaignId: "campaign-1",
      xdr: "backend-prepared-xdr",
    })
    wallet.signTransaction.mockResolvedValue({
      signedTxXdr: "wallet-signed-xdr",
    })
    relay.submitInvestment.mockResolvedValue(confirmedInvestment)
  })

  it("runs prepare-sign-submit with the exact XDR and invalidates live holdings", async () => {
    useInvest()

    await expect(
      getMutationOptions().mutationFn({
        campaignId: "campaign-1",
        amount: "10.0000000",
      })
    ).resolves.toEqual(confirmedInvestment)

    expect(wallet.signTransaction).toHaveBeenCalledWith("backend-prepared-xdr")
    expect(relay.submitInvestment).toHaveBeenCalledWith({
      campaignId: "campaign-1",
      signedXdr: "wallet-signed-xdr",
    })
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["campaigns"],
    })
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["investments", "mine"],
    })
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["holdings", "mine"],
    })
  })

  it("does not sign or submit after a failed prepare, and safely retries from prepare", async () => {
    relay.prepareInvestment
      .mockRejectedValueOnce(new Error("Campaign is not live"))
      .mockResolvedValueOnce({
        campaignId: "campaign-1",
        xdr: "retry-prepared-xdr",
      })
    useInvest()
    const mutation = getMutationOptions()
    const input = { campaignId: "campaign-1", amount: "10.0000000" }

    await expect(mutation.mutationFn(input)).rejects.toThrow(
      "Campaign is not live"
    )
    expect(wallet.signTransaction).not.toHaveBeenCalled()
    expect(relay.submitInvestment).not.toHaveBeenCalled()

    await expect(mutation.mutationFn(input)).resolves.toEqual(
      confirmedInvestment
    )
    expect(wallet.signTransaction).toHaveBeenCalledWith("retry-prepared-xdr")
    expect(relay.submitInvestment).toHaveBeenCalledTimes(1)
  })
})
