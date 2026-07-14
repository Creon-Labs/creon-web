import type { Metadata } from "next"

import { env } from "@/shared/lib/env"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  title: {
    default: "Creon — Web3 Crowdfunding for Indonesian SMEs",
    template: "%s | Creon",
  },
  description:
    "Creon connects Indonesian SME entrepreneurs with investors through Stellar-based crowdfunding, wallet authentication, USDC funding, KYC, and transparent on-chain campaign workflows.",
  keywords: [
    "Creon",
    "Web3 crowdfunding",
    "Indonesian SMEs",
    "UMKM funding",
    "Stellar",
    "Soroban",
    "USDC investment",
    "wallet authentication",
    "SME investment",
  ],
  applicationName: "Creon",
  authors: [{ name: "Creon" }],
  creator: "Creon",
  publisher: "Creon",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Creon",
    title: "Creon — Web3 Crowdfunding for Indonesian SMEs",
    description:
      "Fund verified Indonesian SME campaigns with USDC on Stellar, or raise transparent working capital for your business through Creon.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Indonesian SME coffee business featured on Creon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creon — Web3 Crowdfunding for Indonesian SMEs",
    description:
      "Connect your Stellar wallet to fund or raise capital for verified Indonesian SME campaigns.",
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
