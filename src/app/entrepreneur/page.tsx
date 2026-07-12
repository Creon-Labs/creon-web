"use client"

import { EntrepreneurCampaignListPage } from "@/modules/campaign"
import { AppContainer } from "@/shared/components/layouts/app-container"
import {
  AppHeader,
  usePageTitle,
} from "@/shared/components/sections/app-header"
import { Suspense } from "react"

export default function Page() {
  usePageTitle("Campaigns")

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
