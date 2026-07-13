export function StackedCardsIllustration() {
  return (
    <div className="relative h-24 w-52" aria-hidden="true">
      {/* Back card */}
      <div className="absolute inset-x-6 top-0 h-6 border border-border/50 bg-muted/60 dark:bg-muted/30" />
      {/* Middle card */}
      <div className="absolute inset-x-3 top-3 h-6 border border-border/60 bg-muted/80 dark:bg-muted/50" />
      {/* Front card */}
      <div className="absolute inset-x-0 top-6 flex h-16 items-center gap-3 border border-border bg-background px-4 shadow-sm">
        <div className="size-8 shrink-0 bg-muted" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-2.5 w-3/4 bg-muted" />
          <div className="h-2 w-1/2 bg-muted/60" />
        </div>
      </div>
      {/* Fade overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-b from-background/0 via-background/60 to-background" />
    </div>
  )
}
