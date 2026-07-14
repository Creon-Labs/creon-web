"use client"

import { useAuthMe } from "@/modules/auth"
import { CaretUpDownIcon } from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@shadcn-ui/avatar"
import { SidebarMenuButton, SidebarMenuItem } from "@shadcn-ui/sidebar"
import { UserPopover } from "../user-popover"

export function SidebarUserMenu() {
  const { data: userData } = useAuthMe()

  const initials = userData?.displayName
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <SidebarMenuItem>
      <UserPopover
        side="right"
        align="end"
        alignOffset={12}
        trigger={
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            tooltip={userData?.displayName ?? "..."}
          >
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {userData?.displayName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {userData?.email}
              </span>
            </div>
            <CaretUpDownIcon className="ml-auto shrink-0" />
          </SidebarMenuButton>
        }
      />
    </SidebarMenuItem>
  )
}
