import "./globals.css"

import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"

import { ThemeProvider } from "@/shared/components/provider/theme-provider"
import { ReactQueryProvider } from "@/shared/lib/react-query"
import { cn } from "@/shared/utils/cn"
import { TooltipProvider } from "@shadcn-ui/tooltip"
import { Metadata } from "next"
import { StellarWalletProvider } from "@/shared/lib/stellar-wallet"

const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Creon: Connecting Micro Entrepreneurs to Investors",
  description:
    "Connecting micro entrepreneurs with potential investors for funding and growth opportunities.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        fontHeading.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <TooltipProvider>
              <StellarWalletProvider>{children}</StellarWalletProvider>
            </TooltipProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
