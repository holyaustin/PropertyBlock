// packages/nextjs/components/BuyModal.tsx
"use client";

import { useWalletClient } from "wagmi";
import { CONTRACTS } from "../lib/contracts";

export default function BuyModal({
  propertyId,
  price,
  onClose,
}: {
  propertyId: number;
  price: bigint | number | string;
  onClose: () => void;
}) {
  const { data: walletClient } = useWalletClient();

  async function buy() {
    try {
      if (!walletClient) throw new Error("Connect wallet first");
      await walletClient.writeContract({
        address: CONTRACTS.Marketplace.address as `0x${string}`,
        abi: CONTRACTS.Marketplace.abi as any,
        functionName: "buyProperty",
        args: [BigInt(propertyId)],
        value: BigInt(price ?? 0),
      });
      alert("Purchase tx submitted; check your wallet for tx confirmation.");
      onClose();
    } catch (e: any) {
      console.error(e);
      alert("Transaction failed: " + (e?.message ?? e));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded p-6 w-[420px]">
        <h3 className="text-lg font-semibold mb-2">Confirm Purchase</h3>
        <p className="text-sm text-gray-600 mb-4">Property #{propertyId}</p>
        <div className="mb-4">Price (wei): <strong>{price?.toString?.() ?? "—"}</strong></div>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={buy} className="px-4 py-2 rounded bg-indigo-600 text-white">Confirm & Pay</button>
        </div>
      </div>
    </div>
  );
}
