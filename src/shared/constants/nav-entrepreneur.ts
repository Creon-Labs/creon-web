import {
  ChartLineUpIcon,
  GearSixIcon,
  HandCoinsIcon,
  HouseIcon,
  RocketLaunchIcon,
  WalletIcon,
} from "@phosphor-icons/react/dist/ssr"
import { Route } from "next"

import { SidebarNavItem } from "../types"

/**
 * Returns nav items for the entrepreneur sidebar, with hrefs dynamically
 * resolved to the given `campaignId`.
 *
 * Call this inside a Client Component that has access to `useParams`.
 */
export function getEntrepreneurNavItems(campaignId: string): SidebarNavItem[] {
  return [
    {
      title: "Overview",
      href: `/entrepreneur/${campaignId}/overview` as Route,
      icon: HouseIcon,
    },
    {
      title: "Profit Sharing",
      href: `/entrepreneur/${campaignId}/profit-sharing` as Route,
      icon: ChartLineUpIcon,
    },
    {
      title: "Disbursement",
      href: `/entrepreneur/${campaignId}/disbursment` as Route,
      icon: HandCoinsIcon,
    },
    {
      title: "My Wallet",
      href: `/entrepreneur/${campaignId}/wallet` as Route,
      icon: WalletIcon,
    },
    {
      title: "Settings",
      href: `/entrepreneur/${campaignId}/settings` as Route,
      icon: GearSixIcon,
    },
  ]
}

/**
 * Static nav items that don't depend on a campaign ID
 * (e.g. the top-level campaign list link).
 */
export const entrepreneurStaticNavItems: SidebarNavItem[] = [
  {
    title: "Campaigns",
    href: "/entrepreneur" as Route,
    icon: RocketLaunchIcon,
  },
]
