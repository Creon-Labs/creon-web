"use client"

import { useGetMyHoldings } from "@/modules/holdings"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/shadcn-ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn-ui/table"
import { Badge } from "@/shared/components/shadcn-ui/badge"
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/shadcn-ui/empty"
import { Wallet } from "@phosphor-icons/react/dist/ssr"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/shadcn-ui/alert"

export function HoldingsList() {
  const { data: holdings, isLoading, isError, error } = useGetMyHoldings()

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load holdings: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Holdings</CardTitle>
        <CardDescription>
          A list of your current share ownerships in various campaigns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !holdings || holdings.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Wallet />
              </EmptyMedia>
              <EmptyTitle>No Holdings</EmptyTitle>
              <EmptyDescription>
                You currently do not hold any shares.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding) => (
                  <TableRow key={holding.campaignId}>
                    <TableCell className="font-mono text-xs">
                      {holding.campaignId}
                    </TableCell>
                    <TableCell>
                      {holding.campaign?.projectToken?.assetCode || "-"}
                    </TableCell>
                    <TableCell>{holding.balance}</TableCell>
                    <TableCell>
                      {holding.campaign?.status ? (
                        <Badge variant="secondary">
                          {holding.campaign.status.replace(/_/g, " ")}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
