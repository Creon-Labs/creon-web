"use client"

import { ConnectButton } from "@/shared/lib/stellar-wallet"
import { Button } from "@shadcn-ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="p-6">
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
    </div>
  )
}
