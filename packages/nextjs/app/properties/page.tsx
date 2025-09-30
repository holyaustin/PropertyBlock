"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import registryArtifact from "~~/contracts/PropertyRegistry.json";
const PropertyRegistryAbi = registryArtifact.abi;


type Property = {
  id: number;
  name: string;
  location: string;
  salePrice: string;
  verified: boolean;
};

const PROPERTY_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_PROPERTY_REGISTRY_ADDRESS as `0x${string}`;

export default function PropertiesPage() {
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  // Wagmi v2 hook to read properties
  const { data, isLoading, error } = useReadContract({
    address: PROPERTY_REGISTRY_ADDRESS,
    abi: PropertyRegistryAbi,
    functionName: "getAllProperties", // <-- update if your contract differs
    args: [],
  });

  // Hydrate only after mount (avoids SSR crashes)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Transform raw data from contract
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

  if (!mounted) {
    return <div className="p-6">Loading...</div>;
  }

  if (isLoading) {
    return <div className="p-6">Fetching properties...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load properties: {error.message}
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Properties</h1>

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="border border-gray-200 rounded-lg shadow-md p-4"
            >
              <h2 className="text-xl font-semibold">{prop.name}</h2>
              <p className="text-sm text-gray-600">{prop.location}</p>
              <p className="mt-2">
                <span className="font-medium">Price:</span> {prop.salePrice} ETH
              </p>
              <p className="mt-1">
                <span className="font-medium">Verified:</span>{" "}
                {prop.verified ? "✅" : "❌"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
