/**
 * Full Creon happy path against a running backend and Stellar testnet.
 *
 * This intentionally uses only HTTP endpoints exposed to the frontend. It does
 * not read Prisma or mutate backend state out-of-band. Entrepreneur and investor
 * wallets are ephemeral real Stellar keypairs funded by Friendbot; the public
 * faucet provisions their USDC trustline and balance.
 */
import { randomInt } from "node:crypto"

import { Keypair, Networks } from "@stellar/stellar-sdk"

import {
  ApiSession,
  pollUntil,
  signSep53Message,
  signTransactionXdr,
} from "./testnet-helpers.mjs"

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
)

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable ${name}`)
  return value
}

function positiveIntegerEnv(name, fallback) {
  const raw = process.env[name]
  if (!raw) return fallback
  const value = Number(raw)
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`)
  }
  return value
}

const config = {
  baseUrl:
    process.env.E2E_BASE_API_URL ??
    process.env.NEXT_PUBLIC_BASE_API_URL ??
    "http://127.0.0.1:3000",
  friendbotUrl:
    process.env.E2E_FRIENDBOT_URL ?? "https://friendbot.stellar.org",
  networkPassphrase: process.env.E2E_NETWORK_PASSPHRASE ?? Networks.TESTNET,
  pollIntervalMs: positiveIntegerEnv("E2E_POLL_INTERVAL_MS", 5_000),
  timeoutMs: positiveIntegerEnv("E2E_TIMEOUT_MS", 300_000),
}

if (process.env.E2E_CONFIRM_TESTNET_MUTATIONS !== "yes") {
  throw new Error(
    'Set E2E_CONFIRM_TESTNET_MUTATIONS="yes" to acknowledge that this test creates users, campaigns, and testnet transactions.'
  )
}
if (config.networkPassphrase !== Networks.TESTNET) {
  throw new Error("The happy-path driver is hard-guarded to Stellar testnet")
}

const adminKeypair = Keypair.fromSecret(requiredEnv("E2E_ADMIN_SECRET"))
const entrepreneurKeypair = Keypair.random()
const investorKeypair = Keypair.random()

const admin = new ApiSession(config.baseUrl)
const entrepreneur = new ApiSession(config.baseUrl)
const investor = new ApiSession(config.baseUrl)
const publicApi = new ApiSession(config.baseUrl)

const runId = Date.now().toString(36)
const evidence = {
  runId,
  network: "testnet",
  entrepreneur: entrepreneurKeypair.publicKey(),
  investor: investorKeypair.publicKey(),
  flows: [],
  transactions: [],
}

function record(flow, detail) {
  evidence.flows.push({ flow, detail })
  console.log(`\u2713 ${flow}: ${detail}`)
}

function recordTransaction(kind, txHash) {
  if (txHash) evidence.transactions.push({ kind, txHash })
}

function randomNik() {
  return Array.from({ length: 16 }, () => randomInt(0, 10)).join("")
}

function assertStatus(entity, expected, label) {
  if (entity?.status !== expected) {
    throw new Error(
      `${label} expected status ${expected}, received ${JSON.stringify(entity)}`
    )
  }
  return entity
}

async function fundWithFriendbot(keypair) {
  const response = await fetch(
    `${config.friendbotUrl.replace(/\/$/, "")}?addr=${encodeURIComponent(keypair.publicKey())}`
  )
  if (!response.ok) {
    throw new Error(
      `Friendbot could not fund ${keypair.publicKey()}: ${response.status} ${await response.text()}`
    )
  }
}

async function authenticate(session, keypair, mode, role) {
  const walletAddress = keypair.publicKey()
  const challenge = await session.post("/auth/challenge", { walletAddress })
  if (typeof challenge?.message !== "string") {
    throw new Error("Auth challenge did not return a message")
  }
  const signature = signSep53Message(keypair, challenge.message)
  const body = { walletAddress, signature }
  if (mode === "register") {
    body.role = role
    body.displayName = `${role} E2E ${runId}`
    if (role === "ENTREPRENEUR") {
      body.email = `entrepreneur-${runId}@creon.e2e.test`
    }
  }
  return session.post(`/auth/${mode}`, body, { captureCookie: true })
}

async function provisionFaucetWallet(keypair) {
  const walletAddress = keypair.publicKey()
  await fundWithFriendbot(keypair)
  const prepared = await publicApi.post("/faucet/usdc/trustline/prepare", {
    walletAddress,
  })
  const signedXdr = signTransactionXdr(
    keypair,
    prepared.xdr,
    config.networkPassphrase
  )
  const trustline = await publicApi.post("/faucet/usdc/trustline/submit", {
    walletAddress,
    signedXdr,
  })
  recordTransaction("faucet-trustline", trustline.txHash)
  const claim = await publicApi.post("/faucet/usdc/claim", { walletAddress })
  recordTransaction("faucet-claim", claim.txHash)
  if (claim.walletAddress !== walletAddress || Number(claim.amount) <= 0) {
    throw new Error(`Invalid faucet claim response: ${JSON.stringify(claim)}`)
  }
  return claim
}

async function submitKyc(session, fullName) {
  const form = new FormData()
  form.append("fullName", fullName)
  form.append("nationalId", randomNik())
  form.append(
    "idCard",
    new Blob([TINY_PNG], { type: "image/png" }),
    "id-card.png"
  )
  form.append(
    "selfie",
    new Blob([TINY_PNG], { type: "image/png" }),
    "selfie.png"
  )
  return session.postForm("/kyc", form)
}

async function approveKyc(userId) {
  const result = await admin.post(`/admin/kyc/${userId}/approve`)
  return assertStatus(result, "APPROVED", `KYC ${userId}`)
}

async function createCampaign({ businessName, goal, milestoneAmount }) {
  const proposal = await entrepreneur.post("/proposals", {
    businessName,
    businessDescription: `${businessName} validates the Creon testnet happy path.`,
    category: "F&B",
    location: "Jakarta",
    requestedAmount: goal,
    lockPeriodDays: 30,
    milestones: [
      {
        order: 1,
        title: "E2E milestone",
        description: "Release the verified testnet milestone.",
        amount: milestoneAmount,
      },
    ],
  })
  const submitted = await entrepreneur.post(`/proposals/${proposal.id}/submit`)
  assertStatus(submitted, "SUBMITTED", `Proposal ${proposal.id}`)
  const approval = await admin.post(`/admin/proposals/${proposal.id}/approve`)
  if (!approval?.campaignId) {
    throw new Error(`Proposal approval returned no campaignId`)
  }
  const campaign = await pollUntil({
    label: `campaign ${approval.campaignId} deployment`,
    read: () => publicApi.get(`/campaigns/${approval.campaignId}`),
    accept: (value) =>
      value?.deployStatus === "LIVE" || value?.deployStatus === "FAILED",
    intervalMs: config.pollIntervalMs,
    timeoutMs: config.timeoutMs,
  })
  if (campaign.deployStatus !== "LIVE" || campaign.status !== "ACTIVE") {
    throw new Error(
      `Campaign did not become LIVE/ACTIVE: ${JSON.stringify(campaign)}`
    )
  }
  return campaign
}

async function relay(session, keypair, preparePath, prepareBody, submitPath) {
  const prepared = await session.post(preparePath, prepareBody)
  const signedXdr = signTransactionXdr(
    keypair,
    prepared.xdr,
    config.networkPassphrase
  )
  return session.post(submitPath, { signedXdr })
}

async function investWithWhitelistRetry(campaignId, amount) {
  return pollUntil({
    label: "investor whitelist synchronization and investment confirmation",
    read: () =>
      relay(
        investor,
        investorKeypair,
        `/campaigns/${campaignId}/investments/prepare`,
        { amount },
        `/campaigns/${campaignId}/investments`
      ),
    accept: (value) => value?.status === "CONFIRMED",
    intervalMs: config.pollIntervalMs,
    timeoutMs: config.timeoutMs,
    retryErrors: true,
  })
}

async function waitForHolding(campaignId) {
  return pollUntil({
    label: `indexed holding for campaign ${campaignId}`,
    read: () => investor.get("/holdings/mine"),
    accept: (holdings) =>
      Array.isArray(holdings) &&
      holdings.some(
        (holding) =>
          holding.campaignId === campaignId && Number(holding.balance) > 0
      ),
    intervalMs: config.pollIntervalMs,
    timeoutMs: config.timeoutMs,
  })
}

async function main() {
  console.log(
    `Creon testnet E2E ${runId} -> ${config.baseUrl} (wallet secrets are not persisted)`
  )

  await publicApi.get("/campaigns")

  const entrepreneurFaucet = await provisionFaucetWallet(entrepreneurKeypair)
  const investorFaucet = await provisionFaucetWallet(investorKeypair)
  record(
    "Flow 10 — Faucet",
    `trustline + ${entrepreneurFaucet.amount}/${investorFaucet.amount} USDC claims`
  )

  const entrepreneurPrincipal = await authenticate(
    entrepreneur,
    entrepreneurKeypair,
    "register",
    "ENTREPRENEUR"
  )
  const investorPrincipal = await authenticate(
    investor,
    investorKeypair,
    "register",
    "INVESTOR"
  )
  const adminPrincipal = await authenticate(admin, adminKeypair, "login")
  if (!adminPrincipal.roles?.includes("ADMIN")) {
    throw new Error("E2E_ADMIN_SECRET does not belong to an ADMIN user")
  }
  record("Flow 1 — Wallet auth", "SEP-53 register + admin login cookies")

  assertStatus(
    await submitKyc(entrepreneur, `Entrepreneur E2E ${runId}`),
    "PENDING",
    "Entrepreneur KYC submission"
  )
  assertStatus(
    await submitKyc(investor, `Investor E2E ${runId}`),
    "PENDING",
    "Investor KYC submission"
  )
  await approveKyc(entrepreneurPrincipal.userId)
  await approveKyc(investorPrincipal.userId)
  record("Flow 2 — KYC", "both roles submitted and admin-approved")

  const campaignA = await createCampaign({
    businessName: `Warung Happy Path ${runId}`,
    goal: "20.0000000",
    milestoneAmount: "20.0000000",
  })
  record(
    "Flows 3–4 — Proposal and deploy polling",
    `campaign ${campaignA.id} is LIVE/ACTIVE`
  )

  const investmentA = await investWithWhitelistRetry(campaignA.id, "20.0000000")
  recordTransaction("investment-a", investmentA.txHash)
  await waitForHolding(campaignA.id)
  record("Flow 5 — Invest", "20 USDC confirmed and holding indexed")

  const distribution = await relay(
    entrepreneur,
    entrepreneurKeypair,
    `/campaigns/${campaignA.id}/distributions/deposit/prepare`,
    { amount: "5.0000000" },
    `/campaigns/${campaignA.id}/distributions/deposit`
  )
  assertStatus(distribution, "PENDING", "Distribution deposit")
  const completedDistribution = await pollUntil({
    label: `distribution ${distribution.id}`,
    read: async () => {
      const items = await entrepreneur.get(
        `/campaigns/${campaignA.id}/distributions`
      )
      return items.find((item) => item.id === distribution.id)
    },
    accept: (value) =>
      value?.status === "COMPLETED" || value?.status === "FAILED",
    intervalMs: config.pollIntervalMs,
    timeoutMs: config.timeoutMs,
  })
  assertStatus(completedDistribution, "COMPLETED", "Distribution processing")
  const distributionClaims = await investor.get("/distributions/mine")
  const distributionClaim = distributionClaims.find(
    (claim) => claim.distributionId === distribution.id
  )
  if (!distributionClaim)
    throw new Error("Investor distribution claim was not created")
  const claimedDistribution = await relay(
    investor,
    investorKeypair,
    `/distributions/${distribution.id}/claim/prepare`,
    undefined,
    `/distributions/${distribution.id}/claim`
  )
  assertStatus(claimedDistribution, "CLAIMED", "Distribution claim")
  recordTransaction("distribution-claim", claimedDistribution.claimTxHash)
  record("Flows 6–7 — Dividend", "deposit completed and investor claimed")

  const milestones = await entrepreneur.get(
    `/milestones?campaignId=${encodeURIComponent(campaignA.id)}`
  )
  if (!Array.isArray(milestones) || milestones.length !== 1) {
    throw new Error(
      `Expected one milestone, received ${JSON.stringify(milestones)}`
    )
  }
  const milestone = milestones[0]
  const proof = new FormData()
  proof.append(
    "proof",
    new Blob([TINY_PNG], { type: "image/png" }),
    "milestone-proof.png"
  )
  assertStatus(
    await entrepreneur.postForm(`/milestones/${milestone.id}/submit`, proof),
    "VOTING",
    "Milestone submission"
  )
  const vote = await investor.post(`/milestones/${milestone.id}/vote`, {
    choice: "APPROVE",
  })
  if (vote.choice !== "APPROVE")
    throw new Error("Milestone vote was not recorded")
  const releasedMilestone = await pollUntil({
    label: `milestone ${milestone.id} release`,
    read: () => investor.get(`/milestones/${milestone.id}`),
    accept: (value) =>
      ["RELEASED", "REJECTED", "FAILED"].includes(value?.status),
    intervalMs: config.pollIntervalMs,
    timeoutMs: config.timeoutMs,
  })
  assertStatus(releasedMilestone, "RELEASED", "Milestone release")
  recordTransaction("milestone-release", releasedMilestone.releaseTxHash)
  record(
    "Flow 8 — Milestone",
    "proof, weighted approval, and release completed"
  )

  const campaignB = await createCampaign({
    businessName: `Toko Refund Path ${runId}`,
    goal: "10.0000000",
    milestoneAmount: "10.0000000",
  })
  const investmentB = await investWithWhitelistRetry(campaignB.id, "5.0000000")
  recordTransaction("investment-b", investmentB.txHash)
  await waitForHolding(campaignB.id)
  const openedRefund = await admin.post(
    `/admin/campaigns/${campaignB.id}/cancel`,
    { reason: `E2E ${runId}: verify cancellation and pro-rata refund.` }
  )
  assertStatus(openedRefund, "PENDING", "Refund opening")
  const refund = await pollUntil({
    label: `refund for campaign ${campaignB.id}`,
    read: () => investor.get(`/campaigns/${campaignB.id}/refund`),
    accept: (value) =>
      value?.status === "COMPLETED" || value?.status === "FAILED",
    intervalMs: config.pollIntervalMs,
    timeoutMs: config.timeoutMs,
  })
  assertStatus(refund, "COMPLETED", "Refund processing")
  const refundClaims = await investor.get("/refunds/mine")
  const refundClaim = refundClaims.find((claim) => claim.refundId === refund.id)
  if (!refundClaim)
    throw new Error("Investor refund entitlement was not created")
  const claimedRefund = await relay(
    investor,
    investorKeypair,
    `/refunds/${refund.id}/claim/prepare`,
    undefined,
    `/refunds/${refund.id}/claim`
  )
  assertStatus(claimedRefund, "CLAIMED", "Refund claim")
  recordTransaction("refund-claim", claimedRefund.claimTxHash)
  record(
    "Flow 9 — Cancel/refund",
    "partial campaign cancelled and refund claimed"
  )

  console.log(
    "\nE2E evidence (safe to retain; contains public identifiers only):"
  )
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error("\nTestnet happy path failed")
  console.error(error instanceof Error ? error.stack : error)
  process.exitCode = 1
})
