import { DownloadSimpleIcon, FileTextIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"

import type { MilestoneDetail } from "../types"

type MilestoneProofCardProps = {
  milestone: MilestoneDetail
}

export function MilestoneProofCard({ milestone }: MilestoneProofCardProps) {
  if (!milestone.proofUrl && milestone.status === "PENDING") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileTextIcon weight="duotone" className="size-5" />
            Proof of Progress
          </CardTitle>
          <CardDescription>
            You have not submitted proof of progress for this milestone yet.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileTextIcon weight="duotone" className="size-5" />
          Proof of Progress
        </CardTitle>
        <CardDescription>
          Document attached by the entrepreneur to verify milestone completion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {milestone.proofUrl ? (
          <div className="flex items-center justify-between border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 text-primary">
                <FileTextIcon weight="fill" className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">milestone_proof.pdf</span>
                <span className="text-xs text-muted-foreground">
                  Click to view document
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href={milestone.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadSimpleIcon className="mr-2 size-4" />
                View Proof
              </a>
            </Button>
          </div>
        ) : (
          <div className="border border-dashed p-6 text-center text-sm text-muted-foreground">
            No proof document available for this milestone.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
