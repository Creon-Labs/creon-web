"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import { useAuthMe } from "@/modules/auth"
import { ConnectButton, useStellarWallet } from "@/shared/lib/stellar-wallet"
import { maskAddress } from "@/shared/utils/mask-address"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn-ui/card"
import { Skeleton } from "@shadcn-ui/skeleton"

export default function InvestorSettingsPage() {
  usePageTitle("Settings")
  const { data: user, isLoading } = useAuthMe()
  const { connectedAddress } = useStellarWallet()

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Review the wallet connected to your investor account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet connection</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoading ? (
            <Skeleton className="h-5 w-52" />
          ) : (
            <dl className="grid gap-3 text-sm sm:grid-cols-[9rem_1fr]">
              <dt className="text-muted-foreground">Account wallet</dt>
              <dd className="font-mono">
                {user?.walletAddress
                  ? maskAddress(user.walletAddress)
                  : "Unavailable"}
              </dd>
              <dt className="text-muted-foreground">Connected wallet</dt>
              <dd className="font-mono">
                {connectedAddress
                  ? maskAddress(connectedAddress)
                  : "Not connected"}
              </dd>
            </dl>
          )}
          <div>
            <ConnectButton variant="outline" />
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Account details are managed by your wallet</AlertTitle>
        <AlertDescription>
          Creon uses wallet signatures and an httpOnly session cookie. There is
          no password or private key stored in this app.
        </AlertDescription>
      </Alert>
    </div>
  )
}
