import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

type Role = "ENTREPRENEUR" | "INVESTOR" | "ADMIN"
type KycStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVOKED"
type Session = { userId: string; roles: Role[]; kycStatus?: KycStatus } | null

let session: Session = null

function configureEnvironment() {
  process.env.SECRET_KEY = "test-secret"
  process.env.IMAGE_REMOTE_URL = "https://images.example.test"
  process.env.NEXT_PUBLIC_BASE_API_URL = "https://api.example.test"
  process.env.NEXT_PUBLIC_BASE_URL = "https://app.example.test"
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = "test-project"
}

function response(statusCode: number, data: unknown, message = "Success") {
  return new Response(JSON.stringify({ statusCode, message, data }), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  })
}

function error(statusCode: number, message: string, code: string) {
  return new Response(
    JSON.stringify({ statusCode, message, error: code, data: null }),
    { status: statusCode, statusText: code }
  )
}

function requireSession(): Response | null {
  if (!session) return error(401, "Invalid or expired token", "Unauthorized")
  return null
}

function requiresRole(role: Role): Response | null {
  const unauthenticated = requireSession()
  if (unauthenticated) return unauthenticated
  if (!session?.roles.includes(role)) {
    return error(403, "Insufficient role", "Forbidden")
  }
  return null
}

function requiresApprovedKyc(
  role: "ENTREPRENEUR" | "INVESTOR"
): Response | null {
  const roleError = requiresRole(role)
  if (roleError) return roleError
  if (session?.kycStatus !== "APPROVED") {
    return error(403, "KYC not approved", "Forbidden")
  }
  return null
}

function createBackendContractFetch() {
  return vi.fn(async (input: string | URL, init?: RequestInit) => {
    const url = new URL(input.toString())
    const method = init?.method ?? "GET"

    if (url.pathname === "/kyc/me") {
      const guarded = requiresRole("INVESTOR")
      if (guarded && session?.roles.includes("ENTREPRENEUR")) {
        return response(200, { status: session.kycStatus ?? "PENDING" })
      }
      if (guarded) return guarded
      return response(200, { status: session?.kycStatus ?? "PENDING" })
    }

    if (url.pathname === "/proposals" && method === "POST") {
      const guarded = requiresApprovedKyc("ENTREPRENEUR")
      if (guarded) return guarded
      return response(201, { id: "proposal-owned-by-user-1", status: "DRAFT" })
    }

    if (url.pathname === "/proposals/proposal-owned-by-user-1") {
      const guarded = requiresRole("ENTREPRENEUR")
      if (guarded) return guarded
      if (session?.userId !== "user-1") {
        return error(404, "Proposal not found", "Not Found")
      }
      return response(200, { id: "proposal-owned-by-user-1", status: "DRAFT" })
    }

    if (url.pathname === "/campaigns/campaign-1/investments/prepare") {
      const guarded = requiresApprovedKyc("INVESTOR")
      if (guarded) return guarded
      return response(200, { campaignId: "campaign-1", xdr: "prepared-xdr" })
    }

    if (url.pathname === "/admin/kyc") {
      const guarded = requiresRole("ADMIN")
      if (guarded) return guarded
      return response(200, [])
    }

    return error(404, "Route not found", "Not Found")
  })
}

describe("role and KYC guard contract", () => {
  beforeAll(() => {
    configureEnvironment()
  })

  beforeEach(() => {
    session = null
    vi.stubGlobal("window", {})
    vi.stubGlobal("fetch", createBackendContractFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("surfaces an expired session as a 401 instead of treating it as missing KYC", async () => {
    const { getMyKycStatus } = await import("@/modules/kyc/api/get-kyc-status")

    await expect(getMyKycStatus()).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid or expired token",
    })
  })

  it.each(["PENDING", "REJECTED", "REVOKED"] as const)(
    "blocks entrepreneur proposal creation while KYC is %s",
    async (kycStatus) => {
      session = { userId: "user-1", roles: ["ENTREPRENEUR"], kycStatus }
      const { createProposal } =
        await import("@/modules/proposal/api/create-proposal")

      await expect(
        createProposal({
          businessName: "Creon Coffee",
          businessDescription: "Coffee business",
          category: "Food",
          requestedAmount: "10.0000000",
          lockPeriodDays: 30,
          milestones: [],
        })
      ).rejects.toMatchObject({ statusCode: 403, message: "KYC not approved" })
    }
  )

  it("allows only an approved entrepreneur to create a proposal", async () => {
    session = {
      userId: "user-1",
      roles: ["ENTREPRENEUR"],
      kycStatus: "APPROVED",
    }
    const { createProposal } =
      await import("@/modules/proposal/api/create-proposal")

    await expect(
      createProposal({
        businessName: "Creon Coffee",
        businessDescription: "Coffee business",
        category: "Food",
        requestedAmount: "10.0000000",
        lockPeriodDays: 30,
        milestones: [],
      })
    ).resolves.toMatchObject({
      id: "proposal-owned-by-user-1",
      status: "DRAFT",
    })
  })

  it.each([
    ["entrepreneur", ["ENTREPRENEUR"] as Role[]],
    ["admin", ["ADMIN"] as Role[]],
  ])("blocks a %s from investor-only relay preparation", async (_, roles) => {
    session = { userId: "user-1", roles, kycStatus: "APPROVED" }
    const { prepareInvestment } =
      await import("@/modules/investment/api/prepare-investment")

    await expect(
      prepareInvestment({ campaignId: "campaign-1", amount: "10.0000000" })
    ).rejects.toMatchObject({ statusCode: 403, message: "Insufficient role" })
  })

  it.each(["PENDING", "REJECTED", "REVOKED"] as const)(
    "blocks investor relay preparation while KYC is %s",
    async (kycStatus) => {
      session = { userId: "user-1", roles: ["INVESTOR"], kycStatus }
      const { prepareInvestment } =
        await import("@/modules/investment/api/prepare-investment")

      await expect(
        prepareInvestment({ campaignId: "campaign-1", amount: "10.0000000" })
      ).rejects.toMatchObject({ statusCode: 403, message: "KYC not approved" })
    }
  )

  it("allows an approved investor to prepare a relay transaction", async () => {
    session = { userId: "user-1", roles: ["INVESTOR"], kycStatus: "APPROVED" }
    const { prepareInvestment } =
      await import("@/modules/investment/api/prepare-investment")

    await expect(
      prepareInvestment({ campaignId: "campaign-1", amount: "10.0000000" })
    ).resolves.toEqual({ campaignId: "campaign-1", xdr: "prepared-xdr" })
  })

  it("enforces admin-only access and hides another entrepreneur's resource", async () => {
    session = {
      userId: "user-1",
      roles: ["ENTREPRENEUR"],
      kycStatus: "APPROVED",
    }
    const { getProposalById } =
      await import("@/modules/proposal/api/get-proposal-by-id")
    const { getAdminKycList } =
      await import("@/modules/admin/api/get-admin-kyc-list")

    await expect(
      getProposalById({ id: "proposal-owned-by-user-1" })
    ).resolves.toMatchObject({ id: "proposal-owned-by-user-1" })
    await expect(getAdminKycList()).rejects.toMatchObject({ statusCode: 403 })

    session = {
      userId: "user-2",
      roles: ["ENTREPRENEUR"],
      kycStatus: "APPROVED",
    }
    await expect(
      getProposalById({ id: "proposal-owned-by-user-1" })
    ).rejects.toMatchObject({ statusCode: 404, message: "Proposal not found" })

    session = { userId: "admin-1", roles: ["ADMIN"] }
    await expect(getAdminKycList()).resolves.toEqual([])
  })
})
