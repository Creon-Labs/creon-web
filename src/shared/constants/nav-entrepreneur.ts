import {
  ChartBarIcon,
  GearSixIcon,
  HouseIcon,
  RocketLaunchIcon,
  ShareNetworkIcon,
  TargetIcon,
  VaultIcon,
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
      title: "Holdings",
      href: `/entrepreneur/${campaignId}/holdings` as Route,
      icon: VaultIcon,
    },
    {
      title: "Milestones",
      href: `/entrepreneur/${campaignId}/milestones` as Route,
      icon: TargetIcon,
    },
    {
      title: "Distributions",
      href: `/entrepreneur/${campaignId}/distributions` as Route,
      icon: ShareNetworkIcon,
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
