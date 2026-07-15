type FaucetErrorContext = "TRUSTLINE" | "CLAIM"

export type FaucetErrorKind =
  "ACCOUNT_INACTIVE" | "TRUSTLINE_REQUIRED" | "COOLDOWN" | "UNKNOWN"

export type FaucetErrorInfo = {
  kind: FaucetErrorKind
  title: string
  description: string
}

function getStatusCode(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode
  }
}

function getMessage(error: unknown): string {
  return error instanceof Error ? error.message : ""
}

export function isTrustlineAlreadyExistsError(error: unknown): boolean {
  return getStatusCode(error) === 409
}

export function getFaucetErrorInfo(
  error: unknown,
  context: FaucetErrorContext
): FaucetErrorInfo {
  const statusCode = getStatusCode(error)
  const message = getMessage(error)
  const normalizedMessage = message.toLowerCase()

  if (
    statusCode === 400 &&
    (normalizedMessage.includes("not found on-chain") ||
      normalizedMessage.includes("friendbot"))
  ) {
    return {
      kind: "ACCOUNT_INACTIVE",
      title: "Wallet is not active on Stellar testnet",
      description:
        "Fund this address with testnet XLM through Friendbot, then retry the trustline step.",
    }
  }

  if (
    context === "CLAIM" &&
    statusCode === 400 &&
    normalizedMessage.includes("trustline")
  ) {
    return {
      kind: "TRUSTLINE_REQUIRED",
      title: "USDC trustline is still required",
      description: "Complete the trustline step before claiming test USDC.",
    }
  }

  if (context === "CLAIM" && statusCode === 409) {
    return {
      kind: "COOLDOWN",
      title: "Claim cooldown is active",
      description:
        "This wallet has already claimed. The default cooldown is 24 hours; the API does not expose the exact remaining time.",
    }
  }

  return {
    kind: "UNKNOWN",
    title: context === "CLAIM" ? "USDC claim failed" : "Trustline setup failed",
    description: message || "Please retry from this step.",
  }
}
