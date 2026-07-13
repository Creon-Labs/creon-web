"use client"

import { SidebarMenu, useSidebar } from "@shadcn-ui/sidebar"

import { AppHeader } from "@/shared/components/sections/app-header"
import {
  AppSidebar,
  AppSidebarProps
} from "@/shared/components/sections/sidebar"
import { SidebarUserMenu } from "@/shared/components/sections/sidebar/sidebar-user-menu"
import { investorNavItems } from "@/shared/constants/nav-investor"

const MOCK_USER = {
  name: "Investor User",
  email: "investor@creon.id",
  avatarUrl: undefined,
}

type InvestorSidebarWrapper = Omit<AppSidebarProps, "navGroups" | "footer">

export function InvestorSidebar(props: InvestorSidebarWrapper) {
  return (
    <AppSidebar
      navGroups={[{ items: investorNavItems }]}
      footer={
        <SidebarMenu>
          <SidebarUserMenu user={MOCK_USER} />
        </SidebarMenu>
      }
      {...props}
    />
  )
}

export function InvestorHeader() {
  const { toggleSidebar } = useSidebar()

  return <AppHeader toggleSidebar={toggleSidebar} />
}
