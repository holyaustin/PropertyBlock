import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployMarketplace: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get, execute } = hre.deployments;
  const { ethers } = hre;

  // Fetch deployed registry
  const registryDeployment = await get("PropertyRegistry");
  const registryAddress = registryDeployment.address;

  // Treasury (configurable via env var, fallback deployer)
  const TREASURY = process.env.TREASURY_ADDRESS || deployer;

  console.log("Deploying Marketplace with account:", deployer);

  const result = await deploy("Marketplace", {
    from: deployer,
    args: [registryAddress, TREASURY, deployer],
    log: true,
    autoMine: true,
  });

  console.log("🛒 Marketplace deployed at:", result.address);

  // ✅ Grant Marketplace ADMIN_ROLE in Registry (if not already granted)
  const registry = await ethers.getContractAt("PropertyRegistry", registryAddress);
  const ADMIN_ROLE = await registry.ADMIN_ROLE();

  const hasRole = await registry.hasRole(ADMIN_ROLE, result.address);
  if (!hasRole) {
    console.log("Granting ADMIN_ROLE to Marketplace in PropertyRegistry...");
    await execute(
      "PropertyRegistry",
      { from: deployer, log: true },
      "grantRole",
      ADMIN_ROLE,
      result.address
    );
  }
};

export default deployMarketplace;
deployMarketplace.tags = ["Marketplace"];
deployMarketplace.dependencies = ["PropertyRegistry"];
