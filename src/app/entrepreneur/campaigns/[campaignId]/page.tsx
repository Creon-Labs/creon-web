"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { Button } from "@shadcn-ui/button"
import { use } from "react"

export default function Page({
  params,
}: PageProps<"/entrepreneur/campaigns/[campaignId]">) {
  const { campaignId } = use(params)
  usePageTitle([
    "Campaigns",
    `Coffee Shop Pangadean for Morning Person Working Station`,
  ])

  const { connectedAddress, signMessage } = useStellarWallet()

  const handleSignMessage = async () => {
    if (!connectedAddress) {
      console.error("Wallet is not connected")
      return
    }

    try {
      const message = "Hello, Stellar!"
      const signature = await signMessage(message)
      console.log("Message signed:", signature)
    } catch (error) {
      console.error("Error signing message:", error)
    }
  }

  return (
    <>
      <h1>Entrepreneur Campaigns {campaignId}</h1>
      <Button onClick={handleSignMessage}>Sign</Button>
    </>
  )
}
