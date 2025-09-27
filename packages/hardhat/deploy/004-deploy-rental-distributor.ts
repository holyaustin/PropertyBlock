import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployRentalDistributor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // Use the PropertyToken deployed in step 003 (example)
  const tokenDeployment = await get("PropertyToken");
  const tokenAddress = tokenDeployment.address;

  console.log("Deploying RentalDistributor for token:", tokenAddress);

  const result = await deploy("RentalDistributor", {
    from: deployer,
    args: [tokenAddress],
    log: true,
    autoMine: true,
  });

  console.log("💸 RentalDistributor deployed at:", result.address);
};

export default deployRentalDistributor;
deployRentalDistributor.tags = ["RentalDistributor"];
deployRentalDistributor.dependencies = ["PropertyToken"];
