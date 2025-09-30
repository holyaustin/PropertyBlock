"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "../../lib/contracts";

type Property = {
  id: number;
  name: string;
  location: string;
  salePrice: string;
  verified: boolean;
};

export default function PropertiesPage() {
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.PropertyRegistry.address,
    abi: CONTRACTS.PropertyRegistry.abi,
    functionName: "getAllProperties",
    args: [],
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formatted = data.map((prop: any) => ({
        id: Number(prop[0]),
        name: prop[1],
        location: prop[2],
        salePrice: prop[3]?.toString() ?? "0",
        verified: prop[4] ?? false,
      }));
      setProperties(formatted);
    }
  }, [data]);

  if (!mounted) return <div className="p-6">Loading...</div>;
  if (isLoading) return <div className="p-6">Fetching properties...</div>;
  if (error) return <div className="p-6 text-red-500">Failed: {error.message}</div>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Properties</h1>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(prop => (
            <div key={prop.id} className="border rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold">{prop.name}</h2>
              <p className="text-sm text-gray-600">{prop.location}</p>
              <p className="mt-2">
                <span className="font-medium">Price:</span> {prop.salePrice} ETH
              </p>
              <p className="mt-1">
                <span className="font-medium">Verified:</span> {prop.verified ? "✅" : "❌"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
