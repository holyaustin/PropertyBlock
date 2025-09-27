import { ethers } from "hardhat";
import { expect } from "chai";

describe("PropertyRegistry", function () {
  it("should register, verify and fetch property", async function () {
    const [deployer, user] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("PropertyRegistry");
    const registry = await Registry.deploy(deployer.address);
    await registry.waitForDeployment();

    // User registers property (open registration)
    await registry.connect(user).registerProperty(
      ethers.parseEther("100"),
      1000,
      "ipfs://test"
    );

    const prop = await registry.getProperty(0);
    expect(prop.owner).to.equal(user.address);
    expect(prop.verified).to.equal(false);

    // Admin verifies property
    await registry.connect(deployer).verifyProperty(0, true);
    const verified = await registry.getProperty(0);
    expect(verified.verified).to.equal(true);
  });

  it("should pause/unpause registry", async function () {
    const [deployer] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("PropertyRegistry");
    const registry = await Registry.deploy(deployer.address);
    await registry.waitForDeployment();

    await registry.connect(deployer).pause();
    await expect(registry.registerProperty(1, 1, "ipfs://paused")).to.be.reverted;
    await registry.connect(deployer).unpause();
    await registry.registerProperty(1, 1, "ipfs://unpaused");
    const prop = await registry.getProperty(0);
    expect(prop.active).to.equal(true);
  });
});
