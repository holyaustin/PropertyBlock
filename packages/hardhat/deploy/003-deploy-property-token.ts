import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPropertyToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying sample PropertyToken...");

  const result = await deploy("PropertyToken", {
    from: deployer,
    args: [
      "Sample Property Token", // name
      "SPT",                   // symbol
      1000,                    // supply
      deployer,                // owner
      deployer,                // registry (dummy for now)
      0,                       // propertyId
    ],
    log: true,
    autoMine: true,
  });

  console.log("🏠 PropertyToken deployed at:", result.address);
};

export default deployPropertyToken;
deployPropertyToken.tags = ["PropertyToken"];
