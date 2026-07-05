"use client"

import { useTheme } from "next-themes"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils"
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk"
import {
  KitEventType,
  Networks,
  SwkAppDarkTheme,
  SwkAppLightTheme,
} from "@creit-tech/stellar-wallets-kit/types"

import { walletConnectModule } from "./wc-module"

type SignTransactionOptions = {
  networkPassphrase?: string
  address?: string
  path?: string
}

type SignTransactionFunction = (
  xdr: string,
  opts?: SignTransactionOptions
) => Promise<{ signedTxXdr: string; signerAddress?: string }>

type SignAuthEntryFunction = (
  authEntry: string,
  opts?: SignTransactionOptions
) => Promise<{ signedAuthEntry: string; signerAddress?: string }>

type SignMessageFunction = (
  message: string,
  opts?: SignTransactionOptions
) => Promise<{ signedMessage: string; signerAddress?: string }>

type WalletContextValue = {
  connectedAddress?: string
  disconnect: () => Promise<void>
  signTransaction: SignTransactionFunction
  signAuthEntry: SignAuthEntryFunction
  signMessage: SignMessageFunction
}

const WalletContext = createContext<WalletContextValue | null>(null)

function StellarWalletProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  const [connectedAddress, setConnectedAddress] = useState<string>()

  useEffect(() => {
    StellarWalletsKit.on(KitEventType.STATE_UPDATED, async (event) => {
      const address = event.payload.address
      if (address) {
        setConnectedAddress(event.payload.address)
      }
    })
  }, [])
  useEffect(() => {
    StellarWalletsKit.on(KitEventType.DISCONNECT, async () => {
      setConnectedAddress(undefined)
    })
  }, [])

  const disconnect = useCallback(async () => {
    await StellarWalletsKit.disconnect()
  }, [])

  const signTransaction = useCallback(
    async (xdr: string, opts?: SignTransactionOptions) => {
      return await StellarWalletsKit.signTransaction(xdr, opts)
    },
    []
  )

  const signAuthEntry = useCallback(
    async (authEntry: string, opts?: SignTransactionOptions) => {
      return await StellarWalletsKit.signAuthEntry(authEntry, opts)
    },
    []
  )

  const signMessage = useCallback(
    async (message: string, opts?: SignTransactionOptions) => {
      return await StellarWalletsKit.signMessage(message, opts)
    },
    []
  )

  useEffect(() => {
    if (typeof window !== "undefined") {
      StellarWalletsKit.init({
        theme: {
          ...(theme === "dark" ? SwkAppDarkTheme : SwkAppLightTheme),
          "border-radius": "0",
          background: "var(--card)",
          "font-family": "var(--font-sans)",
          border: "var(--border)",
        },
        modules: [...defaultModules(), walletConnectModule],
        network: Networks.TESTNET,
      })
    }
  }, [theme])

  return (
    <WalletContext.Provider
      value={{
        connectedAddress,
        disconnect,
        signTransaction,
        signAuthEntry,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

function useStellarWallet() {
  const ctx = useContext(WalletContext)

  if (!ctx)
    throw new Error(
      "useStellarWallet must be used within StellarWalletProvider"
    )

  return ctx
}

export { StellarWalletProvider, useStellarWallet, WalletContext }
