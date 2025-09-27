import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying PropertyRegistry with account:", deployer);

  const result = await deploy("PropertyRegistry", {
    from: deployer,
    args: [deployer], // admin
    log: true,
    autoMine: true,
  });

  console.log("📒 PropertyRegistry deployed at:", result.address);
};

export default deployRegistry;
deployRegistry.tags = ["PropertyRegistry"];
