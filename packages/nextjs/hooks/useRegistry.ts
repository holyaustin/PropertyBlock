// packages/nextjs/hooks/useRegistry.ts
"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { CONTRACTS } from "../lib/contracts";

export function useNextPropertyId() {
  const publicClient = usePublicClient();
  const [nextId, setNextId] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!publicClient) return;
        const resp = await publicClient.readContract({
          address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
          abi: CONTRACTS.PropertyRegistry.abi as any,
          functionName: "nextPropertyId",
          args: [], // required by viem type
        });
        if (mounted) setNextId(Number(resp ?? 0));
      } catch (e) {
        // console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [publicClient]);

  return nextId;
}

/** Fetch all properties (suitable for small datasets) */
export function useAllProperties() {
  const publicClient = usePublicClient();
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!publicClient) return;
        const nextIdResp = await publicClient.readContract({
          address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
          abi: CONTRACTS.PropertyRegistry.abi as any,
          functionName: "nextPropertyId",
          args: [],
        });
        const count = Number(nextIdResp ?? 0);
        const calls = [];
        for (let i = 0; i < count; i++) {
          calls.push(
            publicClient.readContract({
              address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
              abi: CONTRACTS.PropertyRegistry.abi as any,
              functionName: "getProperty",
              args: [BigInt(i)],
            })
          );
        }
        const results = await Promise.all(calls);
        if (mounted) setProperties(results);
      } catch (e) {
        // console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [publicClient]);

  return properties;
}
