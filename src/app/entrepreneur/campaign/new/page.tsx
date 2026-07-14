"use client"

import { useGetMyKycStatus } from "@/modules/kyc"
import { CreateProposalPage } from "@/modules/proposal/"
import { AppContainer } from "@/shared/components/layouts/app-container"
import { ArrowUpRightIcon, LockIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shadcn-ui/empty"
import { Spinner } from "@shadcn-ui/spinner"
import { useRouter } from "next/navigation"

export default function Page() {
  const { data: kycData, isLoading } = useGetMyKycStatus({
    config: { retry: false },
  })

  const router = useRouter()

  if (isLoading)
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )

  if (!kycData || kycData.status !== "APPROVED") {
    return (
      <AppContainer className="flex h-dvh items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LockIcon />
            </EmptyMedia>
            <EmptyTitle>KYC Required</EmptyTitle>
            <EmptyDescription>
              You must complete KYC verification before creating a campaign.
              Please complete your KYC to proceed.
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex! gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Back
            </Button>
            <Button size="sm" onClick={() => router.replace("/kyc")}>
              Complete KYC
              <ArrowUpRightIcon />
            </Button>
          </div>
        </Empty>
      </AppContainer>
    )
  }

  return (
    <AppContainer>
      <CreateProposalPage />
    </AppContainer>
  )
}
