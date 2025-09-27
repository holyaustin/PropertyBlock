import { ethers } from "hardhat";
import { expect } from "chai";

describe("PropertyToken", function () {
  it("mints supply to owner", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("PropertyToken");

    const supply = ethers.parseUnits("1000", 18);
    const token = await Token.deploy(
      "TestToken",
      "TTK",
      supply,
      owner.address,
      ethers.ZeroAddress,
      0
    );
    await token.waitForDeployment();

    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(supply);
  });
});
