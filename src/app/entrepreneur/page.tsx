"use client"

import { KycStatusAlert } from "@/modules/kyc"
import { ProposalList } from "@/modules/proposal"
import { AppContainer } from "@/shared/components/layouts/app-container"
import {
  AppHeader,
  usePageTitle,
} from "@/shared/components/sections/app-header"

export default function Page() {
  usePageTitle("Campaign Proposals")

  return (
    <>
      <AppHeader userAvatar />

      <AppContainer>
        <KycStatusAlert />

        <ProposalList />
      </AppContainer>
    </>
  )
}
