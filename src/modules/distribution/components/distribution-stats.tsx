import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import { Coins, CheckCircle, HandCoins } from "@phosphor-icons/react/dist/ssr"
import { ProfitDistribution } from "../types"

interface DistributionStatsProps {
  distributions: ProfitDistribution[]
}

export function DistributionStats({ distributions }: DistributionStatsProps) {
  const totalAmountDistributed = distributions.reduce(
    (acc, dist) => acc + parseFloat(dist.totalAmount),
    0
  )

  const totalClaimed = distributions.reduce(
    (acc, dist) => acc + parseFloat(dist.totalClaimed),
    0
  )

  const activeDistributions = distributions.filter(
    (dist) => dist.status === "COMPLETED"
  ).length

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Distributed
          </CardTitle>
          <Coins className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalAmountDistributed.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <CardDescription>
            Total profit deposited for dividends
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Claimed
          </CardTitle>
          <HandCoins className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalClaimed.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <CardDescription>
            Total amount claimed by investors
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Distributions
          </CardTitle>
          <CheckCircle className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDistributions}</div>
          <CardDescription>
            Distributions ready to be claimed
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
