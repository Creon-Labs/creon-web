import type { Route } from "next"
import Link from "next/link"
import React from "react"

import { DotOutlineIcon } from "@phosphor-icons/react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@shadcn-ui/breadcrumb"
import { cn } from "../utils/cn"

export type BreadcrumbItemType = { label: string; href: string } | string

type ComposedBreadcrumbProps = {
  items: BreadcrumbItemType[]
  className?: string
  listClassName?: string
  itemClassName?: string
  linkClassName?: string
  pageClassName?: string
  separatorClassName?: string
  ellipsisClassName?: string
}

/**
 * ComposedBreadcrumb — a composed wrapper around the shadcn Breadcrumb primitives.
 *
 * Props:
 * - `items`: `{ label: string; href: string }[]` → renders clickable links
 * - `items`: `string[]`                          → renders plain labels (no link)
 *
 * When `items.length > 3`, index 0 is shown, then an ellipsis (…), then
 * the last two items — matching the shadcn breadcrumb example.
 */
export function ComposedBreadcrumb({
  items,
  className,
  listClassName,
  itemClassName,
  linkClassName,
  pageClassName,
  separatorClassName,
  ellipsisClassName,
}: ComposedBreadcrumbProps) {
  const getLabel = (item: BreadcrumbItemType) =>
    typeof item === "string" ? item : item.label

  const getHref = (item: BreadcrumbItemType) =>
    typeof item === "string" ? undefined : item.href

  /**
   * Determine which items to render and whether to show an ellipsis.
   *
   * Rules:
   *  - items.length <= 3 → show all items as-is
   *  - items.length >  3 → show [first, ELLIPSIS, ...last two]
   */
  const shouldCollapse = items.length > 3
  const visibleItems: Array<BreadcrumbItemType | "__ellipsis__"> =
    shouldCollapse ? [items[0], "__ellipsis__", ...items.slice(-2)] : [...items]

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className={listClassName}>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1
          const isEllipsis = item === "__ellipsis__"
          const key = isEllipsis
            ? "__ellipsis__"
            : `${getLabel(item as BreadcrumbItemType)}-${index}`

          const content = isEllipsis ? (
            <BreadcrumbItem key={key} className={itemClassName}>
              <BreadcrumbEllipsis className={ellipsisClassName} />
            </BreadcrumbItem>
          ) : isLast ? (
            /* Last item is always the current page — never a link */
            <BreadcrumbItem data-last-item={true} key={key} className={itemClassName}>
              <BreadcrumbPage className={pageClassName}>
                {getLabel(item as BreadcrumbItemType)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            (() => {
              const href = getHref(item as BreadcrumbItemType)
              const label = getLabel(item as BreadcrumbItemType)

              return (
                <BreadcrumbItem key={key} className={itemClassName}>
                  {href ? (
                    <BreadcrumbLink asChild className={linkClassName}>
                      <Link href={href as Route<string>}>{label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage
                      className={cn("text-muted-foreground!" , pageClassName)}
                    >
                      {label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              )
            })()
          )

          return (
            // BreadcrumbSeparator is also a <li>, so it must be a sibling of
            // BreadcrumbItem — never nested inside it. Use a Fragment to emit
            // both as direct children of the <ol> (BreadcrumbList).
            <React.Fragment key={key}>
              {index > 0 && (
                <BreadcrumbSeparator className={separatorClassName}>
                  <DotOutlineIcon weight="fill"/>
                </BreadcrumbSeparator>
              )}
              {content}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
