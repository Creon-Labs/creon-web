"use client"

import { ImageBrokenIcon } from "@phosphor-icons/react"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"
import React, { useState } from "react"

interface ImageWithFallbackProps extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string | StaticImport
}

const ImageWithFallback = ({
  fallbackSrc,
  src,
  alt,
  ...props
}: ImageWithFallbackProps) => {
  const [isError, setIsError] = useState(false)

  return (
    <>
      {(isError && !fallbackSrc) || !src ? (
        <div
          role="img"
          aria-label="Image failed to load"
          className={
            props.className + " flex items-center justify-center bg-muted"
          }
        >
          <ImageBrokenIcon className="size-1/5 text-muted-foreground" />
        </div>
      ) : (
        <Image
          {...props}
          src={src}
          alt={alt}
          onError={(e) => {
            setIsError(true)
            props.onError?.(e)
          }}
        />
      )}
    </>
  )
}

export default ImageWithFallback
