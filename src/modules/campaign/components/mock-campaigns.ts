import { CampaignItem } from "../types"

/**
 * Mock campaign data — shared between the entrepreneur campaign list page
 * and the campaign-switcher popover in the app header.
 *
 * TODO: Replace with a real API hook (e.g. useGetMyCampaigns) when the backend is ready.
 */
export const mockCampaigns: CampaignItem[] = [
  {
    id: "1",
    title: "Kopi.Online Outlet - Ease of Drinking Coffee for Young People",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    goalAmount: 10_000,
    raisedAmount: 100,
    endAt: "2024-12-31",
    status: "submitted",
    imageUrl: "/temp/kopi-online.webp",
  },
  {
    id: "2",
    title: "Martabak Manis - Sweet and Delicious Martabak for All Ages",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    goalAmount: 15_000,
    raisedAmount: 500,
    endAt: "2024-12-31",
    status: "live",
    imageUrl: "/temp/martabak-manis.webp",
  },
  {
    id: "3",
    title: "Bakso Malang - Authentic Indonesian Meatball Experience",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    goalAmount: 20_000,
    raisedAmount: 1_000,
    endAt: "2024-12-31",
    status: "active",
    imageUrl: "/temp/bakso-malang.webp",
  },
  {
    id: "5",
    title: "Sate Ayam - Grilled Chicken Skewers with Traditional Flavors",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    goalAmount: 12_000,
    raisedAmount: 800,
    endAt: "2024-12-31",
    status: "rejected",
    imageUrl: "/temp/sate-ayam.webp",
    message: "Your campaign was rejected due to insufficient marketing strategy.",
  },
  {
    id: "4",
    title: "Nasi Goreng - Classic Indonesian Fried Rice with a Twist",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    goalAmount: 18_000,
    raisedAmount: 1_200,
    endAt: "2024-12-31",
    status: "under_review",
    imageUrl: "/temp/nasi-goreng.webp",
  },
  {
    id: "6",
    title: "Es Teh Manis - Refreshing Sweet Iced Tea for Hot Days",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.",
    goalAmount: 8_000,
    raisedAmount: 400,
    endAt: "2024-12-31",
    status: "submitted",
    imageUrl: "/temp/es-teh-manis.webp",
  },
]
