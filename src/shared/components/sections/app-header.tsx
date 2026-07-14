"use client"

import { CaretLeftIcon, ListIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import { Skeleton } from "@shadcn-ui/skeleton"
import { usePathname, useRouter } from "next/navigation"
import { useLayoutEffect } from "react"
import { create } from "zustand"
import { ConnectButton } from "../../lib/stellar-wallet"
import { ComposedBreadcrumb } from "../blocks/composed-breadcrumb"
import { H5 } from "../primitives/typography"
import { Avatar, AvatarFallback } from "@shadcn-ui/avatar"
import { UserPopover } from "./user-popover"
import { useAuthMe } from "@/modules/auth"

type HeaderState = {
  title: string | string[] | null
  pathname: string
  setTitle: (title: string | string[], pathname: string) => void
}

export const useHeaderStore = create<HeaderState>((set) => ({
  title: null,
  pathname: "",
  setTitle: (title, pathname) => set({ title, pathname }),
}))

export function usePageTitle(title: string | string[]) {
  const pathname = usePathname()
  const setTitle = useHeaderStore((s) => s.setTitle)

  useLayoutEffect(() => {
    setTitle(title, pathname)
  }, [title, pathname, setTitle])
}

export function AppHeader(props: {
  toggleSidebar?: () => void
  /** Optional custom element rendered in place of the default title text */
  titleSlot?: React.ReactNode
  userAvatar?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { title, pathname: titlePathname } = useHeaderStore()

  const { data: userData } = useAuthMe({
    config: { enabled: props.userAvatar },
  })

  const initials = userData?.displayName
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const isStale = pathname !== titlePathname

  const isArrayTitle = Array.isArray(title)

  const onBack = () => {
    router.back()
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="hidden w-full md:inline">
        {isStale && title === null ? (
          <Skeleton className="h-4 w-40" />
        ) : isStale ? null : !isArrayTitle ? (
          // Render custom slot if provided, otherwise fall back to plain title
          (props.titleSlot ?? <H5>{title}</H5>)
        ) : (
          <div className="flex items-center gap-3">
            <Button
              className="mt-0.5"
              variant={"outline"}
              size={"icon-xs"}
              onClick={onBack}
            >
              <CaretLeftIcon />
            </Button>
            <ComposedBreadcrumb
              items={title}
              className="max-w-2xl"
              listClassName="flex-nowrap"
              itemClassName="group text-sm"
              pageClassName="line-clamp-1"
            />
          </div>
        )}
      </div>
      {props.toggleSidebar && (
        <Button
          onClick={props.toggleSidebar}
          size={"icon-sm"}
          variant={"ghost"}
          className="md:hidden"
        >
          <ListIcon />
        </Button>
      )}

      <div className="flex items-center gap-4">
        <ConnectButton />
        {props.userAvatar && (
          <UserPopover
            isTriggerNotButton
            sideOffset={12}
            align="end"
            trigger={
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            }
          />
        )}
      </div>
    </header>
  )
}
