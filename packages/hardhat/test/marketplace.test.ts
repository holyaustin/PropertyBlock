import { ethers } from "hardhat";
import { expect } from "chai";

describe("Marketplace", function () {
  it("lists and sells property after verification", async function () {
    const [deployer, seller, buyer, treasury] = await ethers.getSigners();

    // Deploy registry
    const Registry = await ethers.getContractFactory("PropertyRegistry");
    const registry = await Registry.deploy(deployer.address);
    await registry.waitForDeployment();

    // Deploy marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(
      await registry.getAddress(),
      treasury.address,
      deployer.address
    );
    await marketplace.waitForDeployment();

    // Grant Marketplace ADMIN_ROLE in Registry (so it can finalizeSale)
    const ADMIN_ROLE = await registry.ADMIN_ROLE();
    await registry.connect(deployer).grantRole(ADMIN_ROLE, await marketplace.getAddress());

    // Seller registers property
    await registry.connect(seller).registerProperty(
      ethers.parseEther("100"),
      1000,
      "ipfs://house"
    );

    // Admin verifies property
    await registry.connect(deployer).verifyProperty(0, true);

    // Seller lists property
    await marketplace.connect(seller).listProperty(0, ethers.parseEther("1"));

    // Buyer purchases property
    const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
    const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

    await expect(
      marketplace.connect(buyer).buyProperty(0, { value: ethers.parseEther("1") })
    ).to.emit(marketplace, "PropertySold");

    // Registry owner updated
    const prop = await registry.getProperty(0);
    expect(prop.owner).to.equal(buyer.address);

    const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
    expect(treasuryBalanceAfter).to.be.gt(treasuryBalanceBefore);
  });
});
