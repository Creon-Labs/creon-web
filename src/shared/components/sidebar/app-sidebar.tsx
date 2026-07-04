"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/shared/utils/cn"
import { ListIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@shadcn-ui/sidebar"

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppSidebarNavItem = {
  title: string
  href: string
  icon: React.ElementType
}

export type AppSidebarNavGroup = {
  /** Optional label for the group. If omitted, no group label is rendered. */
  label?: string
  items: AppSidebarNavItem[]
}

export type AppSidebarFooterProps = {
  /** Render custom content inside SidebarFooter */
  children: React.ReactNode
}

export type AppSidebarProps = {
  /**
   * Navigation structure. Accepts either a flat array of items (single group,
   * no label) or an array of groups for multi-section sidebars.
   */
  navGroups: AppSidebarNavGroup[]

  /** Slot for the footer area (e.g. user profile, logout button). */
  footer?: React.ReactNode

  /** Additional className forwarded to the root <Sidebar> element. */
  className?: string

  /** Any other props forwarded to the underlying <Sidebar> component. */
  sidebarProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Sidebar>,
    "collapsible" | "className"
  >
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function AppSidebarLogo() {
  return (
    <>
      <div className="flex items-center gap-0.5">
        <Image
          src="/logo-icon.svg"
          alt="Creon"
          width={28}
          height={28}
          priority
          className="shrink-0 dark:invert"
        />
        <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
          Creon
        </span>
      </div>
    </>
  )
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function AppSidebarNavItem({ item }: { item: AppSidebarNavItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn("gap-3", isActive && "font-medium")}
      >
        <Link href={item.href}>
          <item.icon weight={isActive ? "fill" : "regular"} />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * `AppSidebar` — a reusable, composable sidebar for all portal scopes.
 *
 * Usage:
 * ```tsx
 * // Wrap with <SidebarProvider> in the layout, then:
 * <AppSidebar
 *   navGroups={[{ items: investorNavItems }]}
 *   footer={<UserMenu />}
 * />
 * ```
 *
 * The component is intentionally minimal — it handles logo switching,
 * active-link detection, and icon-collapse mode. All deeper customizations
 * can be done via `sidebarProps`, `className`, or by composing extra children
 * in the `footer` slot.
 */
export function AppSidebar({
  navGroups,
  footer,
  className,
  sidebarProps,
}: AppSidebarProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon" className={className} {...sidebarProps}>
      {/* ── Header ── */}
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 px-2.5 py-3 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-start">
        <AppSidebarLogo />
        <Button
          onClick={toggleSidebar}
          size={"icon-sm"}
          variant={"ghost"}
          className="ml-auto"
        >
          <ListIcon />
        </Button>
      </SidebarHeader>

      {/* ── Content ── */}
      <SidebarContent>
        {navGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => (
                  <AppSidebarNavItem key={item.href} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer ── */}
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  )
}
