"use client"

import { CaretUpDownIcon, CheckIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@shadcn-ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shadcn-ui/popover"
import { useParams, useRouter } from "next/navigation"
import type { Route } from "next"
import { useState } from "react"

import { CampaignStatusBadge } from "./status-badge"
import { CampaignItem } from "../types"
import { cn } from "@/shared/utils/cn"
import ImageWithFallback from "@/shared/components/primitives/image-with-fallback"

type CampaignSwitcherPopoverProps = {
  campaigns: CampaignItem[]
  /** The title to show on the trigger button (current campaign or page title) */
  title: string
}

export function CampaignSwitcherPopover({
  campaigns,
  title,
}: CampaignSwitcherPopoverProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams<{ campaignId: string }>()

  const activeCampaignId = params?.campaignId

  const handleSelect = (campaignId: string) => {
    setOpen(false)
    router.push(`/entrepreneur/${campaignId}/overview` as Route)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          role="combobox"
          aria-expanded={open}
          className="group h-9 max-w-80 gap-1.5 px-2 text-base font-semibold text-foreground hover:bg-muted/60"
        >
          <span className="truncate">{title}</span>
          <CaretUpDownIcon
            className="shrink-0 opacity-50 transition-transform group-data-[state=open]:rotate-180"
            weight="bold"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        sideOffset={8}
      >
        <Command>
          <CommandInput placeholder="Cari campaign..." />
          <CommandList>
            <CommandEmpty>Tidak ada campaign ditemukan.</CommandEmpty>
            <CommandGroup heading="Campaign Saya">
              {campaigns.map((campaign) => {
                const isActive = campaign.id === activeCampaignId
                return (
                  <CommandItem
                    key={campaign.id}
                    value={`${campaign.id} ${campaign.title}`}
                    onSelect={() => handleSelect(campaign.id)}
                    data-checked={isActive}
                    className="gap-2.5 py-2"
                  >
                    {/* Thumbnail */}
                    <div className="size-8 shrink-0 overflow-hidden rounded-sm border border-border/60">
                      <ImageWithFallback
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        width={32}
                        height={32}
                        className="size-full object-cover"
                      />
                    </div>

                    {/* Title + badge */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={cn(
                          "truncate text-xs font-medium",
                          isActive && "text-foreground"
                        )}
                      >
                        {campaign.title}
                      </span>
                      <CampaignStatusBadge
                        status={campaign.status}
                        size="sm"
                        className="w-fit"
                      />
                    </div>

                    {/* Active checkmark */}
                    <CheckIcon
                      className={cn(
                        "ml-auto size-3.5 shrink-0 transition-opacity",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                      weight="bold"
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>

            <CommandSeparator />

            {/* Quick action to create a new campaign */}
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/entrepreneur/campaigns" as Route)
                }}
                className="gap-2 text-muted-foreground"
              >
                <PlusIcon className="size-3.5" weight="bold" />
                <span>Buat campaign baru</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
