"use client"

import * as React from "react"
import Webcam from "react-webcam"
import {
  CameraIcon,
  ArrowCounterClockwiseIcon,
  CheckIcon,
} from "@phosphor-icons/react"

import { cn } from "@/shared/utils/cn"
import { Button } from "@shadcn-ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn-ui/dialog"

// ---------------------------------------------------------------------------
// WebcamDialogInner — stateful camera view, extracted so its state resets
// naturally via key prop each time the parent dialog opens.
// ---------------------------------------------------------------------------

type WebcamDialogInnerProps = {
  onCapture: (imageSrc: string) => void
  onOpenChange: (open: boolean) => void
}

function WebcamDialogInner({ onCapture, onOpenChange }: WebcamDialogInnerProps) {
  const webcamRef = React.useRef<Webcam>(null)
  const [preview, setPreview] = React.useState<string | null>(null)

  const handleCapture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) setPreview(imageSrc)
  }, [])

  const handleRetake = React.useCallback(() => {
    setPreview(null)
  }, [])

  const handleConfirm = React.useCallback(() => {
    if (preview) {
      onCapture(preview)
      onOpenChange(false)
    }
  }, [preview, onCapture, onOpenChange])

  return (
    <>
      {/* Camera / preview area */}
      <div className="relative aspect-video w-full overflow-hidden rounded-none border bg-muted">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Captured preview"
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

      <DialogFooter>
        {preview ? (
          <>
            <Button type="button" variant="outline" onClick={handleRetake}>
              <ArrowCounterClockwiseIcon data-icon="inline-start" />
              Retake
            </Button>
            <Button type="button" onClick={handleConfirm}>
              <CheckIcon data-icon="inline-start" />
              Use Photo
            </Button>
          </>
        ) : (
          <Button type="button" className="w-full" onClick={handleCapture}>
            <CameraIcon data-icon="inline-start" />
            Capture
          </Button>
        )}
      </DialogFooter>
    </>
  )
}

// ---------------------------------------------------------------------------
// WebcamDialog — Dialog shell; uses key to reset inner state on each open
// ---------------------------------------------------------------------------

type WebcamDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCapture: (imageSrc: string) => void
  title?: string
}

function WebcamDialog({
  open,
  onOpenChange,
  onCapture,
  title = "Take Photo",
}: WebcamDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* key resets inner state each time the dialog opens */}
        <WebcamDialogInner
          key={open ? "open" : "closed"}
          onCapture={onCapture}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// PhotoField — form field UI: trigger button (empty) or preview + retake
// ---------------------------------------------------------------------------

export interface PhotoFieldProps {
  capturedImage: string | null
  onCapture: (imageSrc: string) => void
  onRetake: () => void
  triggerLabel?: string
  dialogTitle?: string
  className?: string
  id?: string
}

export function PhotoField({
  capturedImage,
  onCapture,
  onRetake,
  triggerLabel = "Take Photo",
  dialogTitle = "Take Photo",
  className,
  id,
}: PhotoFieldProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleOpenDialog = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDialogOpen(true)
  }, [])

  const handleRetake = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onRetake()
    },
    [onRetake]
  )

  return (
    <div id={id} className={cn("flex flex-col gap-3", className)}>
      {capturedImage ? (
        /* ── Preview state ── */
        <div className="flex flex-col gap-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-none border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedImage}
              alt="Captured photo preview"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={handleRetake}
          >
            <ArrowCounterClockwiseIcon data-icon="inline-start" />
            Retake Photo
          </Button>
        </div>
      ) : (
        /* ── Empty state — trigger button ── */
        <button
          type="button"
          onClick={handleOpenDialog}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-none border border-dashed border-input py-8 text-muted-foreground transition-colors",
            "hover:border-foreground/30 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-none border border-input bg-muted">
            <CameraIcon weight="duotone" className="size-5" />
          </span>
          <span className="text-xs">{triggerLabel}</span>
        </button>
      )}

      {/* Dialog with webcam */}
      <WebcamDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCapture={onCapture}
        title={dialogTitle}
      />
    </div>
  )
}
