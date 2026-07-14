"use client"

import { useAuthMe } from "@/modules/auth"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import { Skeleton } from "@shadcn-ui/skeleton"
import { useRouter } from "next/navigation"

export function DashboardButton() {
  const router = useRouter()
  const { connectedAddress } = useStellarWallet()
  const { data: userData, isLoading } = useAuthMe({
    config: { enabled: !!connectedAddress },
  })
  const handleClick = () => {
    if (userData?.roles?.includes("ENTREPRENEUR")) {
      router.push("/entrepreneur")
    } else if (userData?.roles?.includes("INVESTOR")) {
      router.push("/investor/overview")
    } else if (userData?.roles?.includes("ADMIN")) {
      router.push("/admin")
    }
  }

  if (isLoading) {
    return <Skeleton className="h-7 w-21" />
  }

  if (!userData) return null

  return (
    <Button size={"sm"} onClick={handleClick}>
      Dashboard <ArrowRightIcon />
    </Button>
  )
}
