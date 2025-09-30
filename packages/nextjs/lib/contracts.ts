// packages/nextjs/lib/contracts.ts
import PropertyRegistryJson from "../contracts/PropertyRegistry.json";
import MarketplaceJson from "../contracts/Marketplace.json";
import PropertyTokenJson from "../contracts/PropertyToken.json";
import RentalDistributorJson from "../contracts/RentalDistributor.json";

function abiFor(j: any) {
  return j.abi ?? j;
}

export const CONTRACTS = {
  PropertyRegistry: {
    address: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ?? "",
    abi: abiFor(PropertyRegistryJson),
  },
  Marketplace: {
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ?? "",
    abi: abiFor(MarketplaceJson),
  },
  PropertyToken: {
    abi: abiFor(PropertyTokenJson),
  },
  RentalDistributor: {
    abi: abiFor(RentalDistributorJson),
  },
};
