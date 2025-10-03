"use client";

import React from "react";
import {
  ConnectKitProvider,
  createConfig,
} from "@particle-network/connectkit";
import { authWalletConnectors } from "@particle-network/connectkit/auth";
import { evmWalletConnectors } from "@particle-network/connectkit/evm";
import { wallet, EntryPosition } from "@particle-network/connectkit/wallet";
import { defineChain } from "@particle-network/connectkit/chains";

// -----------------------------
// Env variables
// -----------------------------
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY as string;
const appId = process.env.NEXT_PUBLIC_APP_ID as string;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

// Fail early if not set
if (!projectId || !clientKey || !appId) {
  throw new Error("Please configure NEXT_PUBLIC_PROJECT_ID, NEXT_PUBLIC_CLIENT_KEY, NEXT_PUBLIC_APP_ID in .env.local");
}

// -----------------------------
// Custom Nebula U2U Testnet
// -----------------------------
const nebulaU2UTestnet = defineChain({
  id: 2484,
  name: "Nebula U2U Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "U2U",
    symbol: "U2U",
  },
  rpcUrls: {
    default: { http: ["https://rpc-nebulas-testnet.uniultra.xyz/"] },
    public: { http: ["https://rpc-nebulas-testnet.uniultra.xyz/"] },
  },
  blockExplorers: {
    default: { name: "U2U Explorer", url: "https://u2uscan.xyz" },
  },
  testnet: true,
  custom: {
    icon: "https://u2u.xyz/assets/logo.png", // replace with real icon if available
  },
});

// -----------------------------
// Particle Config
// -----------------------------
const config = createConfig({
  projectId,
  clientKey,
  appId,
  appearance: {
    language: "en-US",
    mode: "light",
    connectorsOrder: ["email", "phone", "social", "wallet"],
    recommendedWallets: [
      { walletId: "metaMask", label: "Recommended" },
      { walletId: "coinbaseWallet", label: "Popular" },
    ],
    theme: {
      "--pcm-accent-color": "#8b5cf6", // Tailwind purple-500
      //"--pcm-primary-button-background": "#181B1E",
      "--pcm-primary-button-color": "#ffffff",
    },
  },
  walletConnectors: [
    evmWalletConnectors({
      metadata: { name: "PropertyBlock", url: "https://propertyblock.xyz" },
      walletConnectProjectId,
    }),
    authWalletConnectors({
      authTypes: ["email", "google", "apple"],
      fiatCoin: "USD",
      promptSettingConfig: {
        promptMasterPasswordSettingWhenLogin: 1,
        promptPaymentPasswordSettingWhenSign: 1,
      },
    }),
  ],
  plugins: [
    wallet({
      entryPosition: EntryPosition.BR,
      visible: true,
      customStyle: {
        displayTokenAddresses: [],
      },
    }),
  ],
  chains: [nebulaU2UTestnet],
});

// -----------------------------
// Exported Provider
// -----------------------------
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
