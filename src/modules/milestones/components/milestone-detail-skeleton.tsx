import { Skeleton } from "@shadcn-ui/skeleton"

export function MilestoneDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-6 border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex flex-col items-end space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}
