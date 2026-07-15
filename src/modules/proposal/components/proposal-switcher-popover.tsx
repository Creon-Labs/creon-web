"use client"

import { CaretUpDownIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shadcn-ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn-ui/popover"
import type { Route } from "next"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import ImageWithFallback from "@/shared/components/primitives/image-with-fallback"
import { cn } from "@/shared/utils/cn"
import { ProposalWithFundingStats } from "../types"
import { ProposalStatusBadge } from "./status-badge"

type ProposalSwitcherPopoverProps = {
  proposals: ProposalWithFundingStats[]
  /** The title to show on the trigger button (current campaign or page title) */
  title: string
}

export function ProposalSwitcherPopover({
  proposals,
  title,
}: ProposalSwitcherPopoverProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams<{ campaignId: string }>()

  const activeCampaignId = params?.campaignId

  const handleSelect = (proposal: ProposalWithFundingStats) => {
    setOpen(false)
    const href = proposal.campaignId
      ? `/entrepreneur/${proposal.campaignId}/overview`
      : `/entrepreneur/proposals/${proposal.id}`
    router.push(href as Route)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          role="combobox"
          aria-expanded={open}
          className="group h-8 w-fit max-w-80 gap-1.5 px-1 py-0 text-sm font-semibold text-foreground hover:bg-muted/40"
        >
          <span className="truncate">{title}</span>
          <CaretUpDownIcon className="shrink-0 opacity-50 transition-transform" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" sideOffset={8}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No campaign proposal found.</CommandEmpty>
            <CommandGroup>
              {proposals.map((proposal) => {
                const isActive = proposal.campaignId === activeCampaignId
                return (
                  <CommandItem
                    key={proposal.id}
                    value={`${proposal.id} ${proposal.businessName}`}
                    onSelect={() => handleSelect(proposal)}
                    data-checked={isActive}
                    className="gap-2.5 py-2"
                  >
                    {/* Thumbnail */}
                    <div className="size-8 shrink-0 overflow-hidden rounded-sm border border-border/60">
                      <ImageWithFallback
                        src={"/none.jpg"}
                        alt={proposal.businessName}
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
                        {proposal.businessName}
                      </span>
                      <ProposalStatusBadge
                        status={proposal.status}
                        size="sm"
                        className="w-fit border-none bg-transparent! p-0"
                      />
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {/* Quick action to create a new campaign */}
            <CommandGroup className="sticky bottom-0 border-t border-border bg-popover">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/entrepreneur/campaign/new")
                }}
                className="cursor-pointer gap-2 text-muted-foreground"
              >
                <PlusIcon className="size-3.5" weight="bold" />
                <span>New Campaign Proposal</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
