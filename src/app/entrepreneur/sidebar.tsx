"use client"

import { SidebarMenu } from "@shadcn-ui/sidebar"

import { entrepreneurNavItems } from "@/shared/constants/nav-entrepreneur"
import {
  AppSidebar,
  AppSidebarProps,
} from "@/shared/components/sections/sidebar"
import { SidebarUserMenu } from "@/shared/components/sections/sidebar/sidebar-user-menu"

// Mock user — replace with real auth data when auth module is ready
const MOCK_USER = {
  name: "Budi Santoso",
  email: "budi@umkm.co.id",
  avatarUrl: undefined,
}

type EntrepreneurSidebarProps = Omit<AppSidebarProps, "navGroups" | "footer">

export function EntrepreneurSidebar(props: EntrepreneurSidebarProps) {
  return (
    <AppSidebar
      navGroups={[{ items: entrepreneurNavItems }]}
      footer={
        <SidebarMenu>
          <SidebarUserMenu user={MOCK_USER} />
        </SidebarMenu>
      }
      {...props}
    />
  )
}
