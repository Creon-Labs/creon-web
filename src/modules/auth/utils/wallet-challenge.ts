export type SignChallengeMessage = (
  message: string
) => Promise<{ signedMessage: string }>

type CompleteWalletChallengeOptions<TResult> = {
  getChallenge: (walletAddress: string) => Promise<string>
  onChallengeRetry?: () => void
  signMessage: SignChallengeMessage
  submit: (signature: string) => Promise<TResult>
  walletAddress: string
}

export function isExpiredOrUsedChallengeError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    error.statusCode === 401
  )
}

/**
 * Runs the SEP-53 challenge-response flow. A challenge is single use, so a
 * 401 from the final auth endpoint gets one fresh challenge and signature.
 */
export async function completeWalletChallenge<TResult>({
  getChallenge,
  onChallengeRetry,
  signMessage,
  submit,
  walletAddress,
}: CompleteWalletChallengeOptions<TResult>): Promise<TResult> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const challenge = await getChallenge(walletAddress)
    const { signedMessage } = await signMessage(challenge)

    try {
      return await submit(signedMessage)
    } catch (error) {
      if (attempt === 0 && isExpiredOrUsedChallengeError(error)) {
        onChallengeRetry?.()
        continue
      }

      throw error
    }
  }

  throw new Error("Unable to complete wallet authentication")
}
