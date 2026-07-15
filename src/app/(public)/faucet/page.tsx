import type { Metadata } from "next"

import { FaucetPage } from "@/modules/faucet"

export const metadata: Metadata = {
  title: "Test USDC Faucet",
  description:
    "Get Stellar testnet USDC for the Creon demo without registration, login, or KYC.",
  alternates: {
    canonical: "/faucet",
  },
}

export default function Page() {
  return <FaucetPage />
}
