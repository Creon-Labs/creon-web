export function getDistributionDepositErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : ""
  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes("trustline") ||
    normalizedMessage.includes("no trust")
  ) {
    return "Your wallet needs a USDC trustline before it can deposit profit. Add the platform USDC asset, then try again."
  }

  if (
    normalizedMessage.includes("insufficient") ||
    normalizedMessage.includes("underfunded") ||
    normalizedMessage.includes("balance")
  ) {
    return "Your wallet does not have enough USDC for this deposit. Add USDC or enter a smaller amount, then try again."
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    error.statusCode === 409
  ) {
    return "This campaign is not ready to receive a profit deposit. Confirm that it is live, then try again."
  }

  return message || "Failed to distribute profit. Please try again."
}
