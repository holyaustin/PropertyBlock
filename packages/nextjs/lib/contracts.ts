import registryArtifact from "~~/contracts/PropertyRegistry.json";
import marketplaceArtifact from "~~/contracts/Marketplace.json";
import tokenArtifact from "~~/contracts/PropertyToken.json";
import rentalArtifact from "~~/contracts/RentalDistributor.json";

// Load env vars (always strings)
const REGISTRY_ADDR = process.env.NEXT_PUBLIC_PROPERTY_REGISTRY_ADDRESS as `0x${string}`;
const MARKETPLACE_ADDR = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;
const TOKEN_ADDR = process.env.NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS as `0x${string}`;
const RENTAL_ADDR = process.env.NEXT_PUBLIC_RENTAL_DISTRIBUTOR_ADDRESS as `0x${string}`;

// Shared type
export type ContractConfig = {
  address: `0x${string}`;
  abi: any;
};

// Consistent export object
export const CONTRACTS: Record<
  "PropertyRegistry" | "Marketplace" | "PropertyToken" | "RentalDistributor",
  ContractConfig
> = {
  PropertyRegistry: {
    address: REGISTRY_ADDR,
    abi: registryArtifact.abi,
  },
  Marketplace: {
    address: MARKETPLACE_ADDR,
    abi: marketplaceArtifact.abi,
  },
  PropertyToken: {
    address: TOKEN_ADDR,
    abi: tokenArtifact.abi,
  },
  RentalDistributor: {
    address: RENTAL_ADDR,
    abi: rentalArtifact.abi,
  },
};
