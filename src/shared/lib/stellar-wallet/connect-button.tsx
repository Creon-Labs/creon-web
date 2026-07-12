"use client"

import { VariantProps } from "class-variance-authority"
import { useContext, useEffect, useRef } from "react"

import { StellarLogo } from "@/shared/assets/stellar-logo"
import { cn } from "@/shared/utils/cn"
import { maskAddress } from "@/shared/utils/mask-address"
import { ButtonMode } from "@creit-tech/stellar-wallets-kit/components"
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk"

import { SpinnerIcon } from "@phosphor-icons/react"
import { buttonVariants } from "../../components/shadcn-ui/button"
import { WalletContext } from "./provider"

type ButtonConnectWalletProps = VariantProps<typeof buttonVariants> & {
  className?: string
}

function ConnectButton({
  className,
  variant = "default",
  size = "default",
}: ButtonConnectWalletProps) {
  const ctx = useContext(WalletContext)

  if (!ctx)
    throw new Error("ConnectButton must be used within StellarWalletProvider")

  const { connectedAddress, isConnecting } = ctx

  const buttonWrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (buttonWrapper.current) {
      StellarWalletsKit.createButton(buttonWrapper.current, {
        mode: ButtonMode.free,
        children: "-",
        classes: "inset-0 absolute",
      })
    }
  }, [])

  const buttonText = connectedAddress
    ? maskAddress(connectedAddress)
    : "Connect Wallet"

  return (
    <div
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({
          variant: connectedAddress ? "outline" : variant,
          size,
          className,
        }),
        "relative overflow-hidden"
      )}
    >
      {isConnecting ? (
        <SpinnerIcon className="animate-spin" />
      ) : (
        <>
          {connectedAddress && <StellarLogo />}
          {buttonText}
        </>
      )}
      <div
        hidden={isConnecting}
        ref={buttonWrapper}
        className="absolute inset-0 opacity-0"
      />
    </div>
  )
}

export { ConnectButton }
