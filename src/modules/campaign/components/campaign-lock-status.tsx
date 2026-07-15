import { format } from "date-fns"
import {
  LockKeyIcon,
  LockKeyOpenIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"

import type { Campaign } from "../types"
import { getUnlockStatusCopy } from "../utils/campaign-state"
import { Badge } from "@shadcn-ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"

function formatLockEndAt(lockEndAt: string | null): string | null {
  if (!lockEndAt) return null

  const date = new Date(lockEndAt)
  if (Number.isNaN(date.getTime())) return null

  return format(date, "d MMM yyyy, HH:mm")
}

export function CampaignLockStatus({ campaign }: { campaign: Campaign }) {
  const copy = getUnlockStatusCopy(campaign.unlockStatus, campaign.lockEndAt)
  const lockEndAt = formatLockEndAt(campaign.lockEndAt)
  const isUnlocked = campaign.unlockStatus === "UNLOCKED"
  const hasUnlockIssue = campaign.unlockStatus === "FAILED"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Badge variant={isUnlocked ? "default" : "secondary"}>
          {isUnlocked ? (
            <LockKeyOpenIcon data-icon="inline-start" weight="fill" />
          ) : hasUnlockIssue ? (
            <WarningCircleIcon data-icon="inline-start" weight="fill" />
          ) : (
            <LockKeyIcon data-icon="inline-start" weight="fill" />
          )}
          {campaign.unlockStatus.replaceAll("_", " ")}
        </Badge>
        {lockEndAt ? (
          <p className="text-xs text-muted-foreground">
            Scheduled lock end: {lockEndAt}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
