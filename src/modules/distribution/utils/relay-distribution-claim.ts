import type {
  DistributionClaim,
  PrepareDistributionClaimInput,
  PrepareDistributionClaimResponse,
  SubmitDistributionClaimInput,
} from "../types"

export type DistributionClaimStep =
  "IDLE" | "PREPARING" | "SIGNING" | "SUBMITTING"

type RelayDistributionClaimDependencies = {
  prepare: (
    input: PrepareDistributionClaimInput
  ) => Promise<PrepareDistributionClaimResponse>
  sign: (xdr: string) => Promise<{ signedTxXdr: string }>
  submit: (input: SubmitDistributionClaimInput) => Promise<DistributionClaim>
  onStep?: (step: Exclude<DistributionClaimStep, "IDLE">) => void
}

/**
 * Runs the distribution claim relay without altering the XDR prepared by the
 * backend. Any failure can safely be retried by starting this relay again.
 */
export async function relayDistributionClaim(
  { distributionId }: PrepareDistributionClaimInput,
  { prepare, sign, submit, onStep }: RelayDistributionClaimDependencies
): Promise<DistributionClaim> {
  onStep?.("PREPARING")
  const preparedClaim = await prepare({ distributionId })

  onStep?.("SIGNING")
  const { signedTxXdr } = await sign(preparedClaim.xdr)

  onStep?.("SUBMITTING")
  return submit({ distributionId, signedXdr: signedTxXdr })
}
