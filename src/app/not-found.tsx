import { HouseIcon } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@shadcn-ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@shadcn-ui/empty"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <Empty className="max-w-sm border">
        <EmptyHeader>
          <EmptyTitle className="text-xl font-semibold">
            404 — Not Found
          </EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
            <Link href="/">
              <HouseIcon />
              Back to Home
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
