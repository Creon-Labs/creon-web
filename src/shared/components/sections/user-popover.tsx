"use client"

import { useAuthMe, useLogout } from "@/modules/auth"
import { useGetMyKycStatus } from "@/modules/kyc"
import { SealCheckIcon, SignOutIcon } from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@shadcn-ui/avatar"
import { Button } from "@shadcn-ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@shadcn-ui/popover"
import { Separator } from "@shadcn-ui/separator"
import { Spinner } from "@shadcn-ui/spinner"

type UserPopoverProps = {
  trigger?: React.ReactNode
  isTriggerNotButton?: boolean
  align?: "center" | "end" | "start"
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
  alignOffset?: number
}

export function UserPopover({
  trigger,
  isTriggerNotButton = false,
  align,
  side,
  sideOffset,
  alignOffset,
}: UserPopoverProps) {
  const { data: userData } = useAuthMe()
  const { data: kycData } = useGetMyKycStatus()
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const initials = userData?.displayName
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  return (
    <Popover>
      {trigger && (
        <PopoverTrigger asChild={!isTriggerNotButton}>{trigger}</PopoverTrigger>
      )}
      <PopoverContent
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        align={align}
        side={side}
        className="w-xs!"
      >
        <PopoverHeader className="flex flex-row gap-2">
          <Avatar className="size-9">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium">
                {userData?.displayName}
              </span>
              {kycData?.status === "APPROVED" && <KYCBadge />}
            </div>
            <span className="truncate text-xs text-muted-foreground">
              {userData?.email}
            </span>
          </div>
        </PopoverHeader>
        <Separator />
        <div>
          <Button
            variant={"outline"}
            className="w-full text-destructive hover:text-destructive"
            onClick={() => logout(undefined)}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Spinner />
            ) : (
              <>
                <SignOutIcon />
                Logout
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function KYCBadge() {
  return (
    <span className="flex items-center gap-1 border border-success/20 bg-success/10 px-1 py-0.5 text-[0.625rem] text-success">
      KYC
      <SealCheckIcon size={11} />
    </span>
  )
}
