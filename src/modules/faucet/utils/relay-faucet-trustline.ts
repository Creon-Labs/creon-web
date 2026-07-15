import type {
  FaucetTrustlineResult,
  FaucetTrustlineStep,
  PrepareUsdcTrustlineInput,
  PrepareUsdcTrustlineResponse,
  SubmitUsdcTrustlineInput,
  SubmitUsdcTrustlineResponse,
} from "../types"
import { isTrustlineAlreadyExistsError } from "./faucet-error"

type RelayFaucetTrustlineDependencies = {
  prepare: (
    input: PrepareUsdcTrustlineInput
  ) => Promise<PrepareUsdcTrustlineResponse>
  sign: (xdr: string) => Promise<{ signedTxXdr: string }>
  submit: (
    input: SubmitUsdcTrustlineInput
  ) => Promise<SubmitUsdcTrustlineResponse>
  onStep?: (step: FaucetTrustlineStep) => void
}

export async function relayFaucetTrustline(
  input: PrepareUsdcTrustlineInput,
  dependencies: RelayFaucetTrustlineDependencies
): Promise<FaucetTrustlineResult> {
  dependencies.onStep?.("PREPARING")

  let prepared: PrepareUsdcTrustlineResponse
  try {
    prepared = await dependencies.prepare(input)
  } catch (error) {
    if (isTrustlineAlreadyExistsError(error)) {
      return { status: "EXISTS", txHash: null }
    }
    throw error
  }

  dependencies.onStep?.("SIGNING")
  const { signedTxXdr } = await dependencies.sign(prepared.xdr)

  dependencies.onStep?.("SUBMITTING")
  const submitted = await dependencies.submit({
    walletAddress: input.walletAddress,
    signedXdr: signedTxXdr,
  })

  return { status: "CREATED", txHash: submitted.txHash }
}
