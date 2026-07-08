"use client"

import { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { z } from "zod"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSearchState<TSchema extends z.ZodObject<any>>(
  schema?: TSchema
) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = useMemo(() => {
    const raw = Object.fromEntries(searchParams.entries())

    return schema ? schema.parse(raw) : raw
  }, [schema, searchParams])

  const set = useCallback(
    (
      key: keyof z.infer<TSchema>,
      value: z.infer<TSchema>[typeof key] | undefined
    ) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === undefined || value === null || value === "") {
        params.delete(String(key))
      } else {
        params.set(String(key), String(value))
      }

      router.replace(`${pathname}?${params}` as Route)
    },
    [pathname, router, searchParams]
  )

  const setMany = useCallback(
    (values: Partial<z.infer<TSchema>>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      }

      router.replace(`${pathname}?${params}` as Route)
    },
    [pathname, router, searchParams]
  )

  const remove = useCallback(
    <K extends keyof z.infer<TSchema>>(key: K) => {
      const params = new URLSearchParams(searchParams.toString())

      params.delete(String(key))

      router.replace(`${pathname}?${params}` as Route)
    },
    [pathname, router, searchParams]
  )

  return {
    state: value,
    set,
    setMany,
    remove,
  }
}
