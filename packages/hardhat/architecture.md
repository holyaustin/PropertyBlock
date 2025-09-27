Got it ✅ — thanks for the clarifications.
We’ll now build non-upgradeable contracts (OZ v5.4, pragma ^0.8.30) that implement your architecture with fee routing to a treasury wallet (not contract self-storage).

Here’s the final structure:

1. PropertyToken (ERC20 + Permit, per property)

- Minimal ERC20 per property (minted once to property owner).

- Deployed via a factory using minimal proxies (clones) for gas savings.

2. PropertyRegistry

- Holds metadata + state (sale / rent / pause).

- Only the Marketplace can call finalizeSale().

- ADMIN_ROLE can pause specific properties.

- Global pause switch.

3. Marketplace

- Handles listing / buying.

- On purchase: transfers ETH, routes fee to treasury wallet (supplied at deploy), calls registry.finalizeSale(propertyId, buyer).

- Uses nonReentrant.

4. RentalDistributor

- Collects ETH rent from property managers.

- Distributes proportional rent to token holders.


# Deployment Flow (Hardhat)

- Deploy PropertyRegistry with admin.

- Deploy Marketplace with registry + treasury wallet + admin.

- Grant MARKET_ROLE in registry to Marketplace.

- Deploy a PropertyToken (per property) → call registerProperty() in registry.

- Deploy RentalDistributor for each property token.