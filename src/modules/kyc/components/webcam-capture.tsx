"use client"

import * as React from "react"
import Webcam from "react-webcam"
import { CameraIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import { cn } from "@/shared/utils/cn"

export interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void
  onRetake: () => void
  capturedImage: string | null
  label?: string
  className?: string
  id?: string
}

export function WebcamCapture({
  onCapture,
  onRetake,
  capturedImage,
  label = "Capture Photo",
  className,
  id,
}: WebcamCaptureProps) {
  const webcamRef = React.useRef<Webcam>(null)

  const handleCapture = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        onCapture(imageSrc)
      }
    },
    [onCapture]
  )

  const handleRetake = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onRetake()
    },
    [onRetake]
  )

  return (
    <div id={id} className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
        {capturedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Captured photo"
            className="h-full w-full object-cover"
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      
      <div className="flex justify-center">
        {capturedImage ? (
          <Button type="button" variant="outline" onClick={handleRetake}>
            <ArrowCounterClockwiseIcon data-icon="inline-start" />
            Retake Photo
          </Button>
        ) : (
          <Button type="button" onClick={handleCapture}>
            <CameraIcon data-icon="inline-start" />
            {label}
          </Button>
        )}
      </div>
    </div>
  )
}
