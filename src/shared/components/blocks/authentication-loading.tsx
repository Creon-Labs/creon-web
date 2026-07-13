import { cn } from "@/shared/utils/cn"
import { Card, CardContent } from "@shadcn-ui/card"
import { Spinner } from "@shadcn-ui/spinner"

export function AuthenticationLoading({ overlay }: { overlay?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-dvh w-full items-center justify-center",
        overlay && "absolute inset-0 bg-background/50 backdrop:blur-sm"
      )}
    >
      <Card className="mx-auto min-h-36 w-full max-w-xs">
        <CardContent className="flex grow flex-col items-center justify-center gap-4">
          <Spinner className="size-5 opacity-50" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium">Authenticating</p>
            <p className="text-xs text-muted-foreground">
              This may take a few seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
