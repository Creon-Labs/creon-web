export type InvestmentErrorKind =
  "BALANCE" | "CAMPAIGN" | "TRUSTLINE" | "WHITELIST" | "UNKNOWN"

export type InvestmentErrorCopy = {
  kind: InvestmentErrorKind
  title: string
  description: string
}

function getStatusCode(error: unknown): number | undefined {
  if (
    error instanceof Error &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode
  }

  return undefined
}

export function getInvestmentErrorCopy(error: unknown): InvestmentErrorCopy {
  const message = error instanceof Error ? error.message : ""

  if (
    (error instanceof Error &&
      error.name === "CampaignInvestmentUnavailableError") ||
    (getStatusCode(error) === 409 && /campaign|investment/i.test(message))
  ) {
    return {
      kind: "CAMPAIGN",
      title: "Campaign is not accepting investments",
      description:
        "This campaign must be LIVE and ACTIVE. Refresh the page to check its latest status.",
    }
  }

  if (
    (error instanceof Error && error.name === "InvestmentWhitelistSyncError") ||
    /whitelist|not[_ -]?whitelisted|Error\(Contract,\s*#1\)/i.test(message)
  ) {
    return {
      kind: "WHITELIST",
      title: "Investor access is still syncing",
      description:
        "Your KYC is approved, but the wallet whitelist may not be on-chain yet. Wait a moment, then retry from the prepare step.",
    }
  }

  if (
    /trust[ _-]?line|op_no_trust|no trust|not authorized to hold|asset.*authoriz/i.test(
      message
    )
  ) {
    return {
      kind: "TRUSTLINE",
      title: "USDC trustline is required",
      description:
        "Add the Creon test USDC trustline to this wallet, then retry the investment from the prepare step.",
    }
  }

  if (
    /op_underfunded|underfunded|insufficient(?:\s+usdc)?\s+balance|balance\s+is\s+not\s+sufficient/i.test(
      message
    )
  ) {
    return {
      kind: "BALANCE",
      title: "USDC balance is insufficient",
      description:
        "Fund this wallet with enough test USDC for the entered amount, then retry from the prepare step.",
    }
  }

  return {
    kind: "UNKNOWN",
    title: "Investment did not complete",
    description:
      message ||
      "Retry from the prepare step. No investment is recorded until submit succeeds.",
  }
}
