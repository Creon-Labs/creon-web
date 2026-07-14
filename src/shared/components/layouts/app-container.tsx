import { cn } from "../../utils/cn"

type AppContainerProps = {} & React.ComponentProps<"div">

export function AppContainer({
  children,
  className,
  ...props
}: AppContainerProps) {
  return (
    <div
      className={cn(
        "bg-red-10 w-full space-y-4 p-4 md:p-6 xl:mx-auto xl:max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
