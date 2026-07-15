"use client"

import { useState, type ReactNode } from "react"
import {
  ArrowLeftIcon,
  ArrowSquareOutIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  CoinsIcon,
  InfoIcon,
  SpinnerIcon,
  WalletIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"

import { useStellarWallet, ConnectButton } from "@/shared/lib/stellar-wallet"
import { cn } from "@/shared/utils/cn"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import { Separator } from "@shadcn-ui/separator"
import { useClaimUsdc } from "../api/claim-usdc"
import { useSetupUsdcTrustline } from "../api/use-setup-usdc-trustline"
import type { ClaimUsdcResponse } from "../types"
import { getFaucetErrorInfo, type FaucetErrorInfo } from "../utils/faucet-error"

type FaucetNotice = FaucetErrorInfo & {
  variant: "default" | "destructive"
}

const STEP_LABELS = [
  "Connect wallet",
  "Fund testnet XLM",
  "Open USDC trustline",
  "Claim test USDC",
]

const trustlineButtonLabel = {
  IDLE: "Prepare trustline",
  PREPARING: "Checking wallet...",
  SIGNING: "Sign in wallet...",
  SUBMITTING: "Submitting trustline...",
} as const

function TxLink({ txHash, label }: { txHash: string; label: string }) {
  return (
    <a
      href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-mono text-xs break-all underline underline-offset-4"
    >
      <span>
        {label}: {txHash}
      </span>
      <ArrowSquareOutIcon className="size-3 shrink-0" aria-hidden />
    </a>
  )
}

function FlowStep({
  index,
  active,
  complete,
  children,
}: {
  index: number
  active: boolean
  complete: boolean
  children: ReactNode
}) {
  return (
    <li className="grid grid-cols-[2rem_1fr] gap-3">
      <div
        className={cn(
          "flex size-8 items-center justify-center border text-xs font-semibold",
          complete && "border-success bg-success text-white",
          active &&
            !complete &&
            "border-primary bg-primary text-primary-foreground"
        )}
      >
        {complete ? <CheckCircleIcon weight="fill" /> : index + 1}
      </div>
      <div className="pt-1.5">
        <p
          className={cn(
            "font-medium",
            !active && !complete && "text-muted-foreground"
          )}
        >
          {STEP_LABELS[index]}
        </p>
        <div className="mt-2 text-xs leading-5 text-muted-foreground">
          {children}
        </div>
      </div>
    </li>
  )
}

function FaucetWalletFlow({ walletAddress }: { walletAddress?: string }) {
  const [trustlineReady, setTrustlineReady] = useState(false)
  const [trustlineTxHash, setTrustlineTxHash] = useState<string>()
  const [claimResult, setClaimResult] = useState<ClaimUsdcResponse>()
  const [notice, setNotice] = useState<FaucetNotice>()
  const [cooldownEstimate, setCooldownEstimate] = useState<Date>()

  const setupTrustline = useSetupUsdcTrustline()
  const claimMutation = useClaimUsdc()

  const friendbotUrl = walletAddress
    ? `https://friendbot.stellar.org?addr=${encodeURIComponent(walletAddress)}`
    : undefined

  const handleTrustline = async () => {
    if (!walletAddress) return

    setNotice(undefined)
    try {
      const result = await setupTrustline.mutateAsync({ walletAddress })
      setTrustlineReady(true)

      if (result.status === "EXISTS") {
        setNotice({
          kind: "UNKNOWN",
          title: "USDC trustline already exists",
          description:
            "No signature is needed again. Continue directly to the USDC claim.",
          variant: "default",
        })
        return
      }

      setTrustlineTxHash(result.txHash)
      setNotice({
        kind: "UNKNOWN",
        title: "USDC trustline is ready",
        description:
          "The wallet-signed changeTrust transaction was submitted successfully.",
        variant: "default",
      })
    } catch (error) {
      const info = getFaucetErrorInfo(error, "TRUSTLINE")
      setNotice({ ...info, variant: "destructive" })
    }
  }

  const handleClaim = async () => {
    if (!walletAddress) return

    setNotice(undefined)
    try {
      const result = await claimMutation.mutateAsync({ walletAddress })
      setClaimResult(result)
      setCooldownEstimate(new Date(Date.now() + 24 * 60 * 60 * 1000))
      setNotice({
        kind: "UNKNOWN",
        title: `${result.amount} USDC sent`,
        description:
          "The platform signed and submitted this payment. Your wallet was not asked to sign the claim.",
        variant: "default",
      })
    } catch (error) {
      const info = getFaucetErrorInfo(error, "CLAIM")
      if (info.kind === "TRUSTLINE_REQUIRED") setTrustlineReady(false)
      setNotice({ ...info, variant: "destructive" })
    }
  }

  const isConnected = Boolean(walletAddress)
  const isBusy = setupTrustline.isPending || claimMutation.isPending

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <Badge variant="outline">Testnet checklist</Badge>
          <CardTitle className="text-xl">
            Four steps, no account required
          </CardTitle>
          <CardDescription>
            The faucet is public. It never requires registration, login, or KYC.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-6">
            <FlowStep index={0} active={!isConnected} complete={isConnected}>
              Connect the Stellar testnet wallet that should receive USDC.
            </FlowStep>
            <FlowStep
              index={1}
              active={isConnected && !trustlineReady}
              complete={trustlineReady}
            >
              The wallet needs testnet XLM so its account exists on-chain.
              Friendbot funding is free and has no real-world value.
            </FlowStep>
            <FlowStep
              index={2}
              active={isConnected && !trustlineReady}
              complete={trustlineReady}
            >
              Sign the exact changeTrust XDR once. If the trustline already
              exists, the flow skips this signature automatically.
            </FlowStep>
            <FlowStep
              index={3}
              active={trustlineReady && !claimResult}
              complete={Boolean(claimResult)}
            >
              Claim the platform-issued test USDC. This payment does not require
              a wallet signature.
            </FlowStep>
          </ol>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>1. Connect a testnet wallet</CardTitle>
                <CardDescription className="mt-1">
                  Public connection mode does not start the Creon login flow.
                </CardDescription>
              </div>
              <ConnectButton authenticate={false} size="lg" />
            </div>
          </CardHeader>
          {walletAddress ? (
            <CardContent>
              <p className="font-mono text-xs break-all">{walletAddress}</p>
            </CardContent>
          ) : null}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Fund the wallet with testnet XLM</CardTitle>
            <CardDescription>
              A new Stellar address must be funded before the backend can
              prepare its trustline transaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {friendbotUrl ? (
              <Button asChild variant="outline" className="w-fit">
                <a href={friendbotUrl} target="_blank" rel="noreferrer">
                  Fund with Friendbot
                  <ArrowSquareOutIcon aria-hidden />
                </a>
              </Button>
            ) : (
              <Button variant="outline" disabled className="w-fit">
                Connect wallet for Friendbot
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Freighter users can also use its built-in “Fund with Friendbot”
              action. After funding, continue below; prepare doubles as the
              on-chain check.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Add the USDC trustline</CardTitle>
            <CardDescription>
              This is the only faucet step that asks your wallet for a
              signature.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              onClick={handleTrustline}
              disabled={!walletAddress || isBusy || trustlineReady}
              className="w-fit"
            >
              {setupTrustline.isPending ? (
                <SpinnerIcon className="animate-spin" aria-hidden />
              ) : (
                <WalletIcon aria-hidden />
              )}
              {trustlineReady
                ? "Trustline ready"
                : trustlineButtonLabel[setupTrustline.step]}
            </Button>
            {trustlineTxHash ? (
              <TxLink txHash={trustlineTxHash} label="Trustline transaction" />
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center border bg-muted">
                <CoinsIcon aria-hidden />
              </div>
              <div>
                <CardTitle>4. Claim test USDC</CardTitle>
                <CardDescription className="mt-1">
                  The issuer/platform signs this payment. Creon will not open a
                  wallet signature prompt for this step.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-2 border p-3 text-xs text-muted-foreground">
              <ClockCountdownIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden
              />
              <p>
                One claim per wallet per cooldown window. The backend default is
                24 hours, after which the same wallet can claim again.
              </p>
            </div>
            <Button
              onClick={handleClaim}
              disabled={!walletAddress || !trustlineReady || isBusy}
              className="w-fit"
            >
              {claimMutation.isPending ? (
                <SpinnerIcon className="animate-spin" aria-hidden />
              ) : (
                <CoinsIcon aria-hidden />
              )}
              {claimMutation.isPending
                ? "Issuer is sending USDC..."
                : "Claim test USDC"}
            </Button>
            {!trustlineReady ? (
              <p className="text-xs text-muted-foreground">
                Complete or verify the trustline step to enable the claim.
              </p>
            ) : null}
            {claimResult ? (
              <div className="flex flex-col gap-2 border border-success/40 bg-success/5 p-3">
                <p className="flex items-center gap-2 font-medium text-success">
                  <CheckCircleIcon weight="fill" aria-hidden />
                  {claimResult.amount} USDC claimed
                </p>
                <TxLink txHash={claimResult.txHash} label="Claim transaction" />
                {cooldownEstimate ? (
                  <p className="text-xs text-muted-foreground">
                    Estimated next claim after{" "}
                    {cooldownEstimate.toLocaleString()}. The backend remains
                    authoritative if its cooldown differs.
                  </p>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {notice ? (
          <Alert variant={notice.variant}>
            {notice.variant === "destructive" ? (
              <WarningCircleIcon aria-hidden />
            ) : (
              <InfoIcon aria-hidden />
            )}
            <AlertTitle>{notice.title}</AlertTitle>
            <AlertDescription>
              <p>{notice.description}</p>
              {notice.kind === "ACCOUNT_INACTIVE" && friendbotUrl ? (
                <p>
                  <a href={friendbotUrl} target="_blank" rel="noreferrer">
                    Open Friendbot for this wallet
                  </a>
                </p>
              ) : null}
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </div>
  )
}

export function FaucetPage() {
  const { connectedAddress } = useStellarWallet()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Creon home">
            <Image
              src="/logo-text.svg"
              alt="Creon"
              width={112}
              height={36}
              priority
              className="h-auto dark:invert"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Stellar testnet</Badge>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeftIcon aria-hidden />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b bg-muted/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Public faucet</Badge>
            <Badge variant="outline">No login</Badge>
            <Badge variant="outline">No KYC</Badge>
          </div>
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl leading-tight font-semibold tracking-normal sm:text-5xl">
              Get test USDC for the Creon demo.
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Fund a Stellar testnet wallet, open the platform USDC trustline
              once, then receive issuer-signed test USDC. These assets have no
              real-world value.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <FaucetWalletFlow
          key={connectedAddress ?? "disconnected"}
          walletAddress={connectedAddress}
        />
      </section>

      <Separator />
      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <p>
          Faucet requests are sent without authentication cookies or bearer
          tokens.
        </p>
        <p>
          Testnet XLM and USDC are for demonstration only and have no monetary
          value.
        </p>
      </footer>
    </main>
  )
}
