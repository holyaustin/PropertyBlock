// packages/nextjs/app/property/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { CONTRACTS } from "../../../lib/contracts";
import BuyModal from "../../../components/BuyModal";

export default function PropertyPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const publicClient = usePublicClient();
  const [prop, setProp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuy, setShowBuy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!publicClient) return;
        const p = await publicClient.readContract({
          address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
          abi: CONTRACTS.PropertyRegistry.abi as any,
          functionName: "getProperty",
          args: [BigInt(id)],
        });
        if (mounted) setProp(p);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, publicClient]);

  if (loading) return <div>Loading…</div>;
  if (!prop) return <div>Property not found</div>;

  // prop may be returned as an object (named fields) or as an array/tuple.
  const get = (key: string | number) => (typeof key === "number" ? prop[key] : prop?.[key]);

  // Try named fields first
  const salePrice = prop?.salePrice ?? prop?.sale_price ?? get(7) ?? get(5) ?? 0;
  const verified = prop?.verified ?? prop?.isVerified ?? get(6) ?? false;

  const owner = prop?.owner ?? get(1);
  const value = prop?.value ?? get(2);
  const totalFractions = prop?.totalFractions ?? get(3);
  const active = prop?.active ?? get(4);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">Property #{id}</h2>
        <p className="text-sm text-gray-600 mb-4">{prop?.metadataURI ?? prop?.propertyCID ?? get(6) ?? "No metadata"}</p>

        <ul className="text-sm text-gray-700 space-y-1">
          <li>Owner: {owner}</li>
          <li>Value: {value?.toString?.() ?? "—"}</li>
          <li>Fractions: {totalFractions?.toString?.() ?? "—"}</li>
          <li>Status: {active ? "Active" : "Inactive"} | {verified ? "Verified" : "Unverified"}</li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="text-gray-500">Sale price</div>
        <div className="text-2xl font-semibold my-2">{salePrice ? salePrice.toString() : "Not listed"}</div>
        <button
          disabled={!salePrice || !verified}
          onClick={() => setShowBuy(true)}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-40"
        >
          Buy Property
        </button>
      </div>

      {showBuy && <BuyModal propertyId={id} price={BigInt(salePrice ?? 0)} onClose={() => setShowBuy(false)} />}
    </div>
  );
}
