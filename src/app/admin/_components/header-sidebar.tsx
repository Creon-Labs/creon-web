"use client"

import { SidebarMenu, useSidebar } from "@shadcn-ui/sidebar"

import { AppHeader } from "@/shared/components/sections/app-header"
import {
  AppSidebar,
  AppSidebarProps,
} from "@/shared/components/sections/sidebar"
import { SidebarUserMenu } from "@/shared/components/sections/sidebar/sidebar-user-menu"
import { adminNavItems } from "@/shared/constants/nav-admin"

const MOCK_USER = {
  name: "Admin User",
  email: "admin@creon.id",
  avatarUrl: undefined,
}

type AdminSidebarWrapper = Omit<AppSidebarProps, "navGroups" | "footer">

export function AdminSidebar(props: AdminSidebarWrapper) {
  return (
    <AppSidebar
      navGroups={[{ items: adminNavItems }]}
      footer={
        <SidebarMenu>
          <SidebarUserMenu user={MOCK_USER} />
        </SidebarMenu>
      }
      {...props}
    />
  )
}

export function AdminHeader() {
  const { toggleSidebar } = useSidebar()

  return <AppHeader toggleSidebar={toggleSidebar} />
}
