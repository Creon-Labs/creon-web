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
import { Route } from "next"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ApiError } from "../api-client"
// import { walletConnectModule } from "./wc-module"

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

  const disconnect = useCallback(
    async ({ redirect }: { redirect?: Route } = {}) => {
      await StellarWalletsKit.disconnect()

      if (redirect) router.push(redirect)
    },
    [router]
  )

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

        // Get Nonce from Backend
        // TODO: implement Single Responsibility later for this function
        const nonce = await (async () => {
          try {
            return await createAuthNonce(address)
          } catch {
            toast.error("Failed to login", {
              description: "Failed to create auth nonce, please try again!",
            })
            await disconnect()
            return null
          }
        })()

        if (!nonce) return

        // Sign Message
        // TODO: implement Single Responsibility later for this function
        const signedMessage = await (async () => {
          try {
            return (await signMessage(nonce)).signedMessage
          } catch {
            toast.error("Failed to sign message", {
              description: "User rejected the signature request",
            })
            await disconnect()
            return null
          }
        })()

        if (!signedMessage) return

        const data = await loginApi({
          walletAddress: address,
          signature: signedMessage,
        })

        setConnectedAddress(address)
        toast.success("Login successful", {
          description: "You are now logged in",
        })
        switch (data?.roles[0]) {
          case "ENTREPRENEUR":
            router.push("/entrepreneur")
            break
          case "INVESTOR":
            router.push("/investor")
            break
          case "ADMIN":
            router.push("/admin")
            break
        }
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status == 404) {
            router.push(`/register`)
            toast.warning("You are not registered yet!", {
              description: "Please register to continue ",
            })
            setConnectedAddress(address)
            return
          } else {
            toast.error("Failed to login", {
              description: error.message,
            })
            await disconnect()
            return
          }
        }

        // unknown error
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
    if (typeof window !== "undefined") {
      StellarWalletsKit.init({
        theme: {
          ...(theme === "dark" ? SwkAppDarkTheme : SwkAppLightTheme),
          "border-radius": "0",
          background: "var(--card)",
          "font-family": "var(--font-sans)",
          border: "var(--border)",
        },
        modules: [
          ...defaultModules(),
          // walletConnectModule
        ],
        network: Networks.TESTNET,
      })
    }
  }, [theme])

  useEffect(() => {
    StellarWalletsKit.on(KitEventType.STATE_UPDATED, async (event) => {
      const address = event.payload.address
      if (address && !isConnecting) {
        await handleLogin(address)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    StellarWalletsKit.on(KitEventType.DISCONNECT, async () => {
      setConnectedAddress(undefined)
    })
  }, [])

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
