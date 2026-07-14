import { Card, CardContent, CardHeader } from "@shadcn-ui/card"
import { Skeleton } from "@shadcn-ui/skeleton"
import { Separator } from "@shadcn-ui/separator"

// ─── Stat skeletons ───────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <Card className="gap-3">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-sm" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-1.5 h-3 w-40" />
      </CardContent>
    </Card>
  )
}

// ─── Table row skeleton ───────────────────────────────────────────────────────

function TableRowSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-3.5 last:border-0">
      <Skeleton className="h-5 w-8 rounded-md" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20 md:hidden" />
      </div>
      {wide && <Skeleton className="hidden h-4 w-32 md:block" />}
      <Skeleton className="ml-auto h-4 w-20" />
      <Skeleton className="hidden h-2 w-28 rounded-full lg:block" />
    </div>
  )
}

// ─── Main skeleton ────────────────────────────────────────────────────────────

export function HoldingsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>

      {/* Table card */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3.5 w-60" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </CardHeader>

        <Separator className="mt-4" />

        {/* Table header */}
        <div className="flex items-center gap-4 border-b px-4 py-2.5">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="ml-4 hidden h-3.5 w-28 md:block" />
          <Skeleton className="ml-auto h-3.5 w-24" />
          <Skeleton className="hidden h-3.5 w-24 lg:block" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <TableRowSkeleton key={i} wide />
        ))}

        {/* Footer */}
        <div className="flex justify-center border-t px-4 py-3">
          <Skeleton className="h-3 w-64" />
        </div>
      </Card>
    </div>
  )
}
