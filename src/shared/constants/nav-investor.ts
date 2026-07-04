import {
  HouseIcon,
  MegaphoneSimpleIcon,
  TrendUpIcon,
  ArrowLineDownIcon,
  FileTextIcon,
  GearSixIcon,
} from "@phosphor-icons/react/dist/ssr"
import { SidebarNavItem } from "../types"

export const investorNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/investor",
    icon: HouseIcon,
  },
  {
    title: "Campaigns",
    href: "/investor/campaigns",
    icon: MegaphoneSimpleIcon,
  },
  {
    title: "Profit Sharing",
    href: "/investor/profit-sharing",
    icon: TrendUpIcon,
  },
  {
    title: "Disbursement",
    href: "/investor/disbursement",
    icon: ArrowLineDownIcon,
  },
  {
    title: "Laporan",
    href: "/investor/reports",
    icon: FileTextIcon,
  },
  {
    title: "Settings",
    href: "/investor/settings",
    icon: GearSixIcon,
  },
]
