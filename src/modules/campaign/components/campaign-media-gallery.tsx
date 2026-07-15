import { FilePdfIcon } from "@phosphor-icons/react"

import ImageWithFallback from "@/shared/components/primitives/image-with-fallback"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"

import type { ProposalMedia } from "../types"

type CampaignMediaGalleryProps = {
  media: ProposalMedia[]
}

export function CampaignMediaGallery({ media }: CampaignMediaGalleryProps) {
  const images = media.filter((item) => item.kind === "IMAGE")
  const documents = media.filter((item) => item.kind === "DOCUMENT")

  if (images.length === 0 && documents.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign media</CardTitle>
        <CardDescription>
          Images and documents supplied with the approved proposal.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {images.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((image) => (
              <figure key={image.id} className="overflow-hidden border">
                <ImageWithFallback
                  src={image.url}
                  alt={image.originalName ?? "Campaign image"}
                  width={1200}
                  height={675}
                  className="aspect-video h-auto w-full bg-muted object-cover"
                />
                {image.originalName ? (
                  <figcaption className="truncate p-2 text-xs text-muted-foreground">
                    {image.originalName}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        {documents.length > 0 ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Documents</h3>
            <ul className="flex flex-col gap-2">
              {documents.map((document) => (
                <li key={document.id}>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 border p-3 text-sm font-medium hover:bg-muted"
                  >
                    <FilePdfIcon data-icon="inline-start" weight="fill" />
                    <span className="truncate">
                      {document.originalName ?? "Campaign document"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
