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

  async function fetchAdminRole() {
    try {
      if (!publicClient) return;
      return (await publicClient.readContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi,
        functionName: "ADMIN_ROLE",
        args: [], // ✅ required, even if empty
      })) as string;
    } catch (e) {
      console.error("Failed to fetch ADMIN_ROLE", e);
    }
  }

  async function verifyProperty(flag: boolean) {
    if (!walletClient) return alert("Connect wallet");
    try {
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi,
        functionName: "verifyProperty",
        args: [BigInt(propId), flag],
      });
      alert("verifyProperty tx sent");
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  }

  async function grantRole() {
    if (!walletClient) return alert("Connect wallet");
    try {
      const role = roleHex || (await fetchAdminRole());
      if (!role) throw new Error("Role not resolved");
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi,
        functionName: "grantRole",
        args: [role, roleAddress],
      });
      alert("grantRole tx sent");
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  }

  async function revokeRole() {
    if (!walletClient) return alert("Connect wallet");
    try {
      const role = roleHex || (await fetchAdminRole());
      if (!role) throw new Error("Role not resolved");
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi,
        functionName: "revokeRole",
        args: [role, roleAddress],
      });
      alert("revokeRole tx sent");
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  }

  async function updateFee() {
    if (!walletClient) return alert("Connect wallet");
    try {
      await walletClient.writeContract({
        address: CONTRACTS.Marketplace.address as `0x${string}`,
        abi: CONTRACTS.Marketplace.abi,
        functionName: "updateFee",
        args: [Number(feeBps)],
      });
      alert("updateFee tx sent");
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  }

  async function pauseRegistry(flag: boolean) {
    if (!walletClient) return alert("Connect wallet");
    try {
      await walletClient.writeContract({
        address: CONTRACTS.PropertyRegistry.address as `0x${string}`,
        abi: CONTRACTS.PropertyRegistry.abi,
        functionName: flag ? "pause" : "unpause",
        args: [], // ✅ required
      });
      alert(`Registry ${flag ? "paused" : "unpaused"}`);
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  }

  async function pauseMarketplace(flag: boolean) {
    if (!walletClient) return alert("Connect wallet");
    try {
      await walletClient.writeContract({
        address: CONTRACTS.Marketplace.address as `0x${string}`,
        abi: CONTRACTS.Marketplace.abi,
        functionName: flag ? "pause" : "unpause",
        args: [], // ✅ required
      });
      alert(`Marketplace ${flag ? "paused" : "unpaused"}`);
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Admin Console</h2>

      {/* Verify Property */}
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Verify / Unverify Property</h3>
        <div className="flex gap-2">
          <input
            placeholder="Property ID"
            value={propId}
            onChange={e => setPropId(e.target.value)}
            className="border p-2"
          />
          <button
            onClick={() => verifyProperty(true)}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            Verify
          </button>
          <button
            onClick={() => verifyProperty(false)}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Unverify
          </button>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Grant / Revoke Admin Role</h3>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Target address"
            value={roleAddress}
            onChange={e => setRoleAddress(e.target.value)}
            className="border p-2"
          />
          <input
            placeholder="Role bytes32 (optional)"
            value={roleHex}
            onChange={e => setRoleHex(e.target.value)}
            className="border p-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={grantRole}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Grant
          </button>
          <button
            onClick={revokeRole}
            className="px-3 py-2 bg-orange-600 text-white rounded"
          >
            Revoke
          </button>
        </div>
      </section>

      {/* Fee */}
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Update Marketplace Fee</h3>
        <div className="flex gap-2">
          <input
            placeholder="Fee BPS (e.g. 50 = 0.5%)"
            value={feeBps}
            onChange={e => setFeeBps(e.target.value)}
            className="border p-2"
          />
          <button
            onClick={updateFee}
            className="px-3 py-2 bg-indigo-600 text-white rounded"
          >
            Update Fee
          </button>
        </div>
      </section>

      {/* Pause / Unpause */}
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Pause / Unpause Contracts</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => pauseRegistry(true)}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Pause Registry
          </button>
          <button
            onClick={() => pauseRegistry(false)}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            Unpause Registry
          </button>
          <button
            onClick={() => pauseMarketplace(true)}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Pause Marketplace
          </button>
          <button
            onClick={() => pauseMarketplace(false)}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            Unpause Marketplace
          </button>
        </div>
      </section>
    </div>
  );
}
