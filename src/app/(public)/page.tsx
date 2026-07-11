"use client"

import { ConnectButton, useStellarWallet } from "@/shared/lib/stellar-wallet"
import { Button } from "@shadcn-ui/button"
import { Input } from "@shadcn-ui/input"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export default function Page() {
  const { signMessage } = useStellarWallet()
  const [message, setMessage] = useState<string>("")
  const [signResult, setSignResult] = useState<string | null>(null)

  const handleSignMessage = async () => {
    try {
      const signature = await signMessage(message)
      console.log("Signature:", signature)
      setSignResult(signature.signedMessage)
    } catch (error) {
      console.error("Error signing message:", error)
      setSignResult("Error signing message")
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-2">
        <Button variant={"link"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button variant={"link"}>
          <Link href="/entrepreneur">Entrepreneur</Link>
        </Button>
        <Button variant={"link"}>
          <Link href="/investor">Investor</Link>
        </Button>
        <ConnectButton className="ml-auto" />
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter message to sign"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSignMessage}>Sign Message</Button>
      </div>
      {signResult && (
        <div className="rounded-md bg-muted p-4">
          <p className="font-medium">Signature:</p>
          <p>{signResult}</p>
        </div>
      )}
    </div>
  )
}
