import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"

import { ThemeProvider } from "@/shared/components/theme-provider"
import { cn } from "@/shared/utils/cn"
import { TooltipProvider } from "@shadcn-ui/tooltip"
import "./globals.css"

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
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
