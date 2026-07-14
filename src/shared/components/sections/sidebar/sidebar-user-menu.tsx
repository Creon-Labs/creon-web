"use client"

import { CaretUpDownIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@shadcn-ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shadcn-ui/dropdown-menu"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@shadcn-ui/sidebar"

export type SidebarUserMenuProps = {
  user: {
    name: string
    email: string
    avatarUrl?: string
  }
  /** Called when user clicks "Sign Out" */
  onSignOut?: () => void
}

/**
 * `SidebarUserMenu` — footer user profile widget with dropdown actions.
 * Adapts to icon-collapsed state automatically via `useSidebar()`.
 */
export function SidebarUserMenu({ user, onSignOut }: SidebarUserMenuProps) {
  const { isMobile } = useSidebar()

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            tooltip={user.name}
          >
            <Avatar className="size-8 rounded-md">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              )}
              <AvatarFallback className="rounded-md text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <CaretUpDownIcon className="ml-auto shrink-0" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserIcon data-icon="inline-start" />
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onSignOut}
          >
            <SignOutIcon data-icon="inline-start" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
