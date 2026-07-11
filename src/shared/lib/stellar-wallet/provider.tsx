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

import { createAuthNonce, login as loginApi } from "@/modules/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { walletConnectModule } from "./wc-module"
import { setLocalStorage } from "@/shared/utils/localstorage"

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
  isConnecting: boolean
  disconnect: () => Promise<void>
  signTransaction: SignTransactionFunction
  signAuthEntry: SignAuthEntryFunction
  signMessage: SignMessageFunction
}

const WalletContext = createContext<WalletContextValue | null>(null)

function StellarWalletProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  const [connectedAddress, setConnectedAddress] = useState<string>()
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

  const router = useRouter()

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

  const handleLogin = useCallback(
    async (address: string) => {
      try {
        setIsConnecting(true)
        const nonce = await createAuthNonce(address)

        if (!nonce) throw new Error("Failed to create auth nonce")

        let signedMessage
        try {
          signedMessage = (await signMessage(nonce)).signedMessage
          setLocalStorage("auth_signature", signedMessage)
        } catch {
          toast.error("Failed to sign message")
          await disconnect()
          return
        }

        const { error, statusCode, message } = await loginApi({
          walletAddress: address,
          signature: signedMessage,
        })

        if (statusCode == 404) {
          router.push(`/register`)
          toast.warning("You are not registered yet!", {
            description: "Please register to continue ",
          })
          setConnectedAddress(address)

          return
        }
        if (error) {
          toast.error("Failed to login", {
            description: message,
          })
          await disconnect()
          return
        }

        setConnectedAddress(address)

        return
      } catch {
        toast.error("Failed to login", {
          description: "Something went wrong, please try again later.",
        })
        await disconnect()
      } finally {
        setIsConnecting(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    StellarWalletsKit.on(KitEventType.STATE_UPDATED, async (event) => {
      const address = event.payload.address
      if (address) {
        await handleLogin(address)
      }
    })
  }, [handleLogin, signMessage])
  useEffect(() => {
    StellarWalletsKit.on(KitEventType.DISCONNECT, async () => {
      setConnectedAddress(undefined)
    })
  }, [])

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
        isConnecting,
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
