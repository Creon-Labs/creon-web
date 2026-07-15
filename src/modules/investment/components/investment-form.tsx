"use client"

import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import type { Route } from "next"
import Link from "next/link"
import { toast } from "sonner"

import {
  canInvestInCampaign,
  getCampaignInvestmentBlockReason,
  type Campaign,
} from "@/modules/campaign"
import { useGetMyKycStatus } from "@/modules/kyc"
import { useHookForm } from "@/shared/lib/hook-form"
import { ConnectButton, useStellarWallet } from "@/shared/lib/stellar-wallet"
import { formatUsdcAmount } from "@/shared/utils/format-usdc"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shadcn-ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@shadcn-ui/input-group"
import { Spinner } from "@shadcn-ui/spinner"

import { useInvest } from "../api/use-invest"
import {
  investmentSchema,
  type InvestmentFormValues,
} from "../schema/investment-schema"
import { getInvestmentErrorCopy } from "../utils/investment-error"

const INVESTMENT_STEPS = [
  { id: "PREPARING", label: "Prepare transaction" },
  { id: "SIGNING", label: "Sign in wallet" },
  { id: "SUBMITTING", label: "Submit on Stellar" },
] as const

type InvestmentStep = (typeof INVESTMENT_STEPS)[number]["id"] | "IDLE"

function submitLabel(step: InvestmentStep): string {
  if (step === "PREPARING") return "Preparing transaction..."
  if (step === "SIGNING") return "Waiting for wallet..."
  if (step === "SUBMITTING") return "Submitting investment..."
  return "Invest with USDC"
}

export function InvestmentForm({ campaign }: { campaign: Campaign }) {
  const { connectedAddress } = useStellarWallet()
  const { data: kycProfile, isLoading: isKycLoading } = useGetMyKycStatus()
  const form = useHookForm({
    schema: investmentSchema,
    defaultValues: { amount: "" },
  })
  const investment = useInvest({
    config: {
      onSuccess: (result) => {
        form.reset()
        toast.success("Investment confirmed", {
          description: `${formatUsdcAmount(result.amount)} USDC was invested successfully.`,
        })
      },
    },
  })

  const campaignBlockReason = getCampaignInvestmentBlockReason(campaign)
  const isKycApproved = kycProfile?.status === "APPROVED"
  const canSubmit =
    Boolean(connectedAddress) &&
    isKycApproved &&
    canInvestInCampaign(campaign) &&
    !investment.isPending
  const amountError = form.formState.errors.amount
  const errorCopy = investment.error
    ? getInvestmentErrorCopy(investment.error)
    : null

  function onSubmit(values: InvestmentFormValues) {
    investment.mutate({ campaignId: campaign.id, amount: values.amount })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Invest in this business</CardTitle>
          <CardDescription>
            Confirmed USDC is converted to project shares at a 1:1 ratio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Alert>
            <InfoIcon weight="fill" />
            <AlertTitle>Check your wallet before investing</AlertTitle>
            <AlertDescription>
              This wallet needs the Creon test USDC trustline and enough USDC
              for the amount entered. Shares remain restricted during the
              campaign lock period.
            </AlertDescription>
          </Alert>

          {!isKycLoading && !isKycApproved ? (
            <Alert>
              <WarningCircleIcon weight="fill" />
              <AlertTitle>Approved KYC is required</AlertTitle>
              <AlertDescription className="flex flex-col items-start gap-3">
                <span>
                  Complete investor verification before preparing an investment.
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link href={"/kyc" as Route}>Open KYC</Link>
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          {campaignBlockReason ? (
            <Alert>
              <WarningCircleIcon weight="fill" />
              <AlertTitle>Investment is currently unavailable</AlertTitle>
              <AlertDescription>{campaignBlockReason}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field data-invalid={!!amountError || undefined}>
              <FieldLabel htmlFor="investment-amount">
                Investment amount
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="investment-amount"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="500.0000000"
                  aria-invalid={!!amountError}
                  disabled={investment.isPending}
                  {...form.register("amount")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>USDC</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Enter a positive amount with up to seven decimal places.
              </FieldDescription>
              <FieldError>{amountError?.message}</FieldError>
            </Field>
          </FieldGroup>

          <InvestmentProgress
            step={investment.step}
            isConfirmed={investment.data?.status === "CONFIRMED"}
          />

          {errorCopy ? (
            <Alert variant="destructive">
              <WarningCircleIcon weight="fill" />
              <AlertTitle>{errorCopy.title}</AlertTitle>
              <AlertDescription>{errorCopy.description}</AlertDescription>
            </Alert>
          ) : null}

          {investment.data?.status === "CONFIRMED" ? (
            <Alert>
              <CheckCircleIcon weight="fill" />
              <AlertTitle>Investment confirmed</AlertTitle>
              <AlertDescription className="flex flex-col gap-1">
                <span>
                  {formatUsdcAmount(investment.data.amount)} USDC invested and{" "}
                  {formatUsdcAmount(investment.data.lpTokens ?? "0")} shares
                  minted.
                </span>
                {investment.data.txHash ? (
                  <span className="font-mono text-xs break-all">
                    Tx: {investment.data.txHash}
                  </span>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {connectedAddress ? (
            <Button className="w-full" type="submit" disabled={!canSubmit}>
              {investment.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : null}
              {submitLabel(investment.step)}
            </Button>
          ) : (
            <ConnectButton className="w-full" />
          )}
          <p className="text-xs text-muted-foreground">
            If any relay step fails, it is safe to retry from prepare. Nothing
            is recorded until submit succeeds.
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}

function InvestmentProgress({
  step,
  isConfirmed,
}: {
  step: InvestmentStep
  isConfirmed: boolean
}) {
  const activeIndex = INVESTMENT_STEPS.findIndex((item) => item.id === step)

  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {INVESTMENT_STEPS.map((item, index) => {
        const isCurrent = item.id === step
        const isComplete =
          isConfirmed || (activeIndex >= 0 && index < activeIndex)

        return (
          <li key={item.id} className="flex flex-col gap-2 border p-3">
            <span className="text-xs text-muted-foreground">
              Step {index + 1}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {isCurrent ? (
                <Spinner data-icon="inline-start" />
              ) : isComplete ? (
                <CheckCircleIcon data-icon="inline-start" weight="fill" />
              ) : null}
              {isCurrent ? "In progress" : isComplete ? "Complete" : "Queued"}
            </Badge>
          </li>
        )
      })}
    </ol>
  )
}
