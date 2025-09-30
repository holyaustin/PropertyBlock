// packages/nextjs/app/admin/page.tsx
"use client";

import { useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { CONTRACTS } from "../../lib/contracts";

export default function AdminPage() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [propId, setPropId] = useState("");
  const [roleAddress, setRoleAddress] = useState("");
  const [roleHex, setRoleHex] = useState("");
  const [feeBps, setFeeBps] = useState("");

  async function fetchAdminRole(): Promise<string | undefined> {
    try {
      if (!publicClient) return undefined;
      const role = await publicClient.readContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi as any,
        functionName: "ADMIN_ROLE",
        args: [],
      });
      return role as string;
    } catch (e) {
      console.error("Failed to read ADMIN_ROLE", e);
      return undefined;
    }
  }

  async function verifyProperty(flag: boolean) {
    try {
      if (!walletClient) throw new Error("Connect wallet");
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi as any,
        functionName: "verifyProperty",
        args: [BigInt(propId), flag],
      });
      alert("verifyProperty tx sent");
    } catch (e: any) {
      alert("Error: " + (e?.message ?? e));
    }
  }

  async function grantRole() {
    try {
      if (!walletClient) throw new Error("Connect wallet");
      const role = roleHex || (await fetchAdminRole());
      if (!role) throw new Error("Cannot determine role");
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi as any,
        functionName: "grantRole",
        args: [role, roleAddress],
      });
      alert("grantRole tx sent");
    } catch (e: any) {
      alert("Error: " + (e?.message ?? e));
    }
  }

  async function revokeRole() {
    try {
      if (!walletClient) throw new Error("Connect wallet");
      const role = roleHex || (await fetchAdminRole());
      if (!role) throw new Error("Cannot determine role");
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi as any,
        functionName: "revokeRole",
        args: [role, roleAddress],
      });
      alert("revokeRole tx sent");
    } catch (e: any) {
      alert("Error: " + (e?.message ?? e));
    }
  }

  async function updateFee() {
    try {
      if (!walletClient) throw new Error("Connect wallet");
      await walletClient.writeContract({
        address: CONTRACTS.Marketplace.address as `0x${string}`,
        abi: CONTRACTS.Marketplace.abi as any,
        functionName: "updateFee",
        args: [Number(feeBps)],
      });
      alert("updateFee tx sent");
    } catch (e: any) {
      alert("Error: " + (e?.message ?? e));
    }
  }

  async function pauseRegistry() {
    if (!walletClient) return alert("Connect wallet");
    try {
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi as any,
        functionName: "pause",
        args: [],
      });
      alert("registry paused");
    } catch (e: any) {
      alert("Error: " + (e?.message ?? e));
    }
  }

  async function unpauseRegistry() {
    if (!walletClient) return alert("Connect wallet");
    try {
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi as any,
        functionName: "unpause",
        args: [],
      });
      alert("registry unpaused");
    } catch (e: any) {
      alert("Error: " + (e?.message ?? e));
    }
  }

  async function pauseMarketplace() {
    if (!walletClient) return alert("Connect wallet");
    try {
      await walletClient.writeContract({
        address: CONTRACTS.Marketplace.address as `0x${string}`,
        abi: CONTRACTS.Marketplace.abi as any,
        functionName: "pause",
        args: [],
      });
      alert("marketplace paused");
    } catch (e: any) {
      alert("Error: " + (e?.message ?? e));
    }
  }

  async function unpauseMarketplace() {
    if (!walletClient) return alert("Connect wallet");
    try {
      await walletClient.writeContract({
        address: CONTRACTS.Marketplace.address as `0x${string}`,
        abi: CONTRACTS.Marketplace.abi as any,
        functionName: "unpause",
        args: [],
      });
      alert("marketplace unpaused");
    } catch (e: any) {
      alert("Error: " + (e?.message ?? e));
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Console</h2>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Verify / Unverify Property</h3>
        <div className="flex gap-2">
          <input placeholder="Property ID" value={propId} onChange={(e) => setPropId(e.target.value)} className="border p-2" />
          <button onClick={() => verifyProperty(true)} className="px-3 py-2 bg-green-600 text-white rounded">Verify</button>
          <button onClick={() => verifyProperty(false)} className="px-3 py-2 bg-red-600 text-white rounded">Unverify</button>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Grant / Revoke Role (Admin Role)</h3>
        <div className="flex gap-2 mb-2">
          <input placeholder="Target address" value={roleAddress} onChange={(e) => setRoleAddress(e.target.value)} className="border p-2" />
          <input placeholder="Role bytes32 (optional)" value={roleHex} onChange={(e) => setRoleHex(e.target.value)} className="border p-2" />
        </div>
        <div className="flex gap-2">
          <button onClick={grantRole} className="px-3 py-2 bg-blue-600 text-white rounded">Grant</button>
          <button onClick={revokeRole} className="px-3 py-2 bg-orange-600 text-white rounded">Revoke</button>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Update Marketplace Fee</h3>
        <div className="flex gap-2">
          <input placeholder="Fee BPS (e.g. 50 = 0.5%)" value={feeBps} onChange={(e) => setFeeBps(e.target.value)} className="border p-2" />
          <button onClick={updateFee} className="px-3 py-2 bg-indigo-600 text-white rounded">Update Fee</button>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Pause / Unpause Contracts</h3>
        <div className="flex gap-2">
          <button onClick={pauseRegistry} className="px-3 py-2 bg-red-600 text-white rounded">Pause Registry</button>
          <button onClick={unpauseRegistry} className="px-3 py-2 bg-green-600 text-white rounded">Unpause Registry</button>
          <button onClick={pauseMarketplace} className="px-3 py-2 bg-red-600 text-white rounded">Pause Marketplace</button>
          <button onClick={unpauseMarketplace} className="px-3 py-2 bg-green-600 text-white rounded">Unpause Marketplace</button>
        </div>
      </section>

      <div className="text-sm text-gray-500">
        Notes:
        <ul className="list-disc ml-5">
          <li>Grant/Revoke expects a bytes32 role value; leave blank to use ADMIN_ROLE constant fetched from registry.</li>
          <li>All actions require an admin wallet connected and to be admin on-chain.</li>
        </ul>
      </div>
    </div>
  );
}
