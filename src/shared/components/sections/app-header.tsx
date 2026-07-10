"use client"

import { BellIcon, CaretLeftIcon, ListIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import { useSidebar } from "@shadcn-ui/sidebar"
import { ConnectButton } from "../../lib/stellar-wallet"
import { H5 } from "../primitives/typography"
import { create } from "zustand"
import { usePathname } from "next/navigation"
import { useLayoutEffect } from "react"
import { Skeleton } from "@shadcn-ui/skeleton"
import { ComposedBreadcrumb } from "../blocks/composed-breadcrumb"
import { useRouter } from "next/navigation"

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

export function AppHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const { title, pathname: titlePathname } = useHeaderStore()

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
          <H5>{title}</H5>
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
      <Button
        onClick={toggleSidebar}
        size={"icon-sm"}
        variant={"ghost"}
        className="md:hidden"
      >
        <ListIcon />
      </Button>

      <div className="flex items-center gap-4">
        <Button variant={"ghost"} size={"icon"}>
          <BellIcon />
        </Button>
        <ConnectButton />
      </div>
    </header>
  )
}
