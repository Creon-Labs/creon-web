import {
  ArrowRightIcon,
  BankIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  CoinsIcon,
  FingerprintIcon,
  GaugeIcon,
  HandCoinsIcon,
  IdentificationCardIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StorefrontIcon,
  WalletIcon,
} from "@phosphor-icons/react/ssr"
import Image from "next/image"
import Link from "next/link"

import ImageWithFallback from "@/shared/components/primitives/image-with-fallback"
import { ConnectButton } from "@/shared/lib/stellar-wallet"
import { Badge } from "@shadcn-ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import { Progress } from "@shadcn-ui/progress"
import { Separator } from "@shadcn-ui/separator"
import { DashboardButton } from "./_components/dashboard-button"

const navigationItems = [
  { href: "#entrepreneurs", label: "Entrepreneurs" },
  { href: "#investors", label: "Investors" },
  { href: "#workflow", label: "Workflow" },
  { href: "#trust", label: "Trust" },
]

const metrics = [
  { label: "Target raise", value: "USDC 48K" },
  { label: "Lock period", value: "180 days" },
  { label: "Network", value: "Stellar" },
]

const audienceCards = [
  {
    id: "entrepreneurs",
    eyebrow: "For Entrepreneurs",
    title: "Turn a verified business proposal into live working capital.",
    description:
      "Submit your SME funding proposal, complete KYC, and let admins review the campaign before it is deployed on-chain.",
    icon: StorefrontIcon,
    points: [
      "Create a funding proposal with milestones and requested capital.",
      "Use campaign media to show the real business behind the raise.",
      "Receive capital through a transparent Stellar campaign lifecycle.",
    ],
  },
  {
    id: "investors",
    eyebrow: "For Investors",
    title: "Back Indonesian SMEs with USDC and wallet-signed actions.",
    description:
      "Browse live campaigns, invest with USDC, and track holdings and distributions through Creon's investor portal.",
    icon: ChartLineUpIcon,
    points: [
      "Connect a Stellar wallet and verify identity once.",
      "Fund approved campaigns only after deployment is live.",
      "Claim profit distributions through the prepare, sign, submit flow.",
    ],
  },
]

const workflowSteps = [
  {
    title: "Proposal review",
    description:
      "SME owners submit funding details, milestones, and media before admin review.",
    icon: IdentificationCardIcon,
  },
  {
    title: "Auto-deploy campaign",
    description:
      "Approved proposals become Stellar campaigns with project tokens and USDC funding rails.",
    icon: SparkleIcon,
  },
  {
    title: "Invest with USDC",
    description:
      "Investors fund live campaigns using wallet signatures and stablecoin capital.",
    icon: CoinsIcon,
  },
  {
    title: "Sign, submit, settle",
    description:
      "On-chain actions follow the relay pattern while the platform covers network fees.",
    icon: HandCoinsIcon,
  },
]

const trustItems = [
  {
    title: "Wallet-based authentication",
    description:
      "Users sign a challenge with their Stellar wallet. No password vault, no client-side token storage.",
    icon: WalletIcon,
  },
  {
    title: "KYC before protected actions",
    description:
      "Identity checks gate proposal submission, investing, and claim flows for a cleaner marketplace.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Exact XDR signing",
    description:
      "Wallets sign the XDR returned by the backend exactly as prepared for the contract action.",
    icon: FingerprintIcon,
  },
  {
    title: "Locked capital period",
    description:
      "Campaign funds stay stable during the agreed lock window while the business executes milestones.",
    icon: LockKeyIcon,
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Creon home" className="shrink-0">
            <Image
              src="/logo-text.svg"
              alt="Creon"
              width={112}
              height={36}
              priority
              className="dark:invert"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-xs font-medium text-muted-foreground md:flex"
          >
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-2">
            <ConnectButton size="sm" />
            <DashboardButton />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-foreground/[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
          <div className="flex max-w-3xl flex-col gap-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Stellar crowdfunding</Badge>
              <Badge variant="secondary">USDC rails</Badge>
              <Badge variant="secondary">Indonesian SMEs</Badge>
            </div>

            <div className="flex flex-col gap-5">
              <h1 className="max-w-4xl font-heading text-4xl leading-tight font-semibold tracking-normal text-balance sm:text-5xl lg:text-6xl">
                Web3 crowdfunding for Indonesian SMEs on Stellar.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Creon connects verified entrepreneurs with investors who want to
                fund real businesses through transparent campaigns, wallet
                signatures, and USDC-backed capital flows.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ConnectButton size="lg" />
              <p className="max-w-md text-xs leading-5 text-muted-foreground">
                Connect your wallet to start registration, access role-based
                portals, and sign approved on-chain actions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border bg-background/80 p-4 backdrop-blur"
                >
                  <p className="text-xs text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-2 font-heading text-xl font-semibold">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden border bg-muted sm:aspect-5/4 lg:aspect-4/5">
              <ImageWithFallback
                src="/none.jpg"
                alt="An Indonesian SME coffee business prepared for online sales"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background via-background/80 to-background/0 p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border bg-background/90 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">
                        Campaign progress
                      </span>
                      <Badge variant="outline">Live</Badge>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <p className="font-heading text-2xl font-semibold">72%</p>
                      <p className="text-xs text-muted-foreground">
                        USDC 34.8K raised
                      </p>
                    </div>
                    <Progress value={72} className="mt-4" />
                  </div>

                  <div className="border bg-background/90 p-4 backdrop-blur">
                    <p className="text-xs text-muted-foreground">
                      Next milestone
                    </p>
                    <p className="mt-2 font-heading text-sm font-medium">
                      Expand roasting capacity and packaging workflow.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <GaugeIcon aria-hidden className="size-4" />
                      Admin reviewed, contract live
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="outline">Two-sided marketplace</Badge>
            <h2 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-normal sm:text-4xl">
              Capital access for builders, curated opportunities for backers.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {audienceCards.map((card) => {
              const Icon = card.icon

              return (
                <Card key={card.eyebrow} id={card.id} className="min-h-full">
                  <CardHeader>
                    <div className="mb-3 flex size-10 items-center justify-center border bg-muted text-muted-foreground">
                      <Icon aria-hidden className="size-5" />
                    </div>
                    <CardDescription>{card.eyebrow}</CardDescription>
                    <CardTitle className="text-xl leading-snug">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {card.description}
                    </p>
                    <Separator className="my-5" />
                    <ul className="flex flex-col gap-3">
                      {card.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm leading-6"
                        >
                          <CheckCircleIcon
                            aria-hidden
                            weight="fill"
                            className="mt-1 size-4 shrink-0 text-success"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="justify-between gap-3 text-xs text-muted-foreground">
                    <span>Role-aware onboarding</span>
                    <ArrowRightIcon aria-hidden className="size-4" />
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30 py-16 sm:py-20" id="workflow">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1fr] lg:items-end">
            <div>
              <Badge variant="secondary">How Creon works</Badge>
              <h2 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-normal sm:text-4xl">
                From proposal to signed on-chain action.
              </h2>
            </div>
            <p className="text-sm leading-6 text-muted-foreground lg:max-w-xl">
              Creon keeps business review off-chain where it belongs, then uses
              Stellar and Soroban for campaign funding, wallet authorization,
              and transparent transaction execution.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <Card key={step.title} size="sm">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex size-9 items-center justify-center border bg-background text-muted-foreground">
                        <Icon aria-hidden className="size-4" />
                      </div>
                      <Badge variant="outline">
                        {String(index + 1).padStart(2, "0")}
                      </Badge>
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b py-16 sm:py-20" id="trust">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1fr] lg:px-8">
          <div className="flex flex-col gap-5">
            <Badge variant="outline">Trust architecture</Badge>
            <h2 className="font-heading text-3xl leading-tight font-semibold tracking-normal sm:text-4xl">
              Designed around verified users and exact wallet intent.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Authentication uses wallet signatures, protected actions require
              KYC approval, and every on-chain step is prepared before the user
              signs it. The experience stays clear without hiding the mechanics
              that matter.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustItems.map((item) => {
              const Icon = item.icon

              return (
                <Card key={item.title} size="sm">
                  <CardHeader>
                    <div className="mb-2 flex size-9 items-center justify-center border bg-muted text-muted-foreground">
                      <Icon aria-hidden className="size-4" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 bg-card p-6 text-foreground sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <Badge variant="secondary">Start with your Stellar wallet</Badge>
              <h2 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-normal sm:text-4xl">
                Connect once, then choose the role that fits your next move.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Entrepreneurs can prepare funding proposals. Investors can
                discover live campaigns. Both paths begin with wallet-based
                identity and a clean registration flow.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <Link href="/register" className="hover:text-background">
                  Registration
                </Link>
                <Link
                  href="/investor/discovers"
                  className="hover:text-background"
                >
                  Discover campaigns
                </Link>
                <Link href="/entrepreneur" className="hover:text-background">
                  Entrepreneur portal
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-background p-4 text-foreground">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <BankIcon aria-hidden className="size-4" />
                Stellar wallet login
              </div>
              <ConnectButton size="lg" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
