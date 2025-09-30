// packages/nextjs/lib/hedera.ts
import { defineChain } from "viem";

export const hederaTestnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_HEDERA_CHAIN_ID ?? 296),
  name: "Hedera Testnet",
  network: "hedera-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "HBAR",
    symbol: "HBAR",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HEDERA_RPC_URL ?? "https://testnet.hashio.io/api"],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_HEDERA_RPC_URL ?? "https://testnet.hashio.io/api"],
    },
  },
  blockExplorers: {
    default: { name: "HashScan", url: "https://hashscan.io/testnet" },
  },
  testnet: true,
});
