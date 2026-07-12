"use client"

import { EntrepreneurCampaignListPage } from "@/modules/campaign"
import { useGetMyKycStatus } from "@/modules/kyc"
import { AppContainer } from "@/shared/components/layouts/app-container"
import {
  AppHeader,
  usePageTitle,
} from "@/shared/components/sections/app-header"
import { Suspense } from "react"

export default function Page() {
  usePageTitle("Campaigns")

  const { data: kycStatus } = useGetMyKycStatus()

  console.log({ kycStatus })

  return (
    <>
      <AppHeader />

      <AppContainer>
        <Suspense>
          <EntrepreneurCampaignListPage />
        </Suspense>
      </AppContainer>
    </>
  )
}
