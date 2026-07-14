import { WalletConnectModule } from "@creit-tech/stellar-wallets-kit/modules/wallet-connect"

import { env } from "../env"

const walletConnectModule = new WalletConnectModule({
  projectId: env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  metadata: {
    name: "Creon Web",
    description:
      "Connecting micro entrepreneurs with potential investors for funding and growth opportunities.",
    icons: [`${env.NEXT_PUBLIC_BASE_URL}/logo-icon-framed.svg`],
    url: env.NEXT_PUBLIC_BASE_URL,
  },
})

export { walletConnectModule }
