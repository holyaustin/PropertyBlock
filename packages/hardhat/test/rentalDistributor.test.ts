import { ethers } from "hardhat";
import { expect } from "chai";

describe("RentalDistributor", function () {
  it("distributes ETH rent to token holders", async function () {
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy token
    const Token = await ethers.getContractFactory("PropertyToken");
    const supply = ethers.parseUnits("1000", 18);
    const token = await Token.deploy("RentToken", "RNT", supply, owner.address, ethers.ZeroAddress, 0);
    await token.waitForDeployment();

    // Transfer tokens to two users
    await token.transfer(user1.address, ethers.parseUnits("600", 18));
    await token.transfer(user2.address, ethers.parseUnits("400", 18));

    // Deploy distributor
    const Distributor = await ethers.getContractFactory("RentalDistributor");
    const distributor = await Distributor.deploy(await token.getAddress());
    await distributor.waitForDeployment();

    // Send ETH to distributor
    await owner.sendTransaction({
      to: await distributor.getAddress(),
      value: ethers.parseEther("10"),
    });

    // user1 withdraws
    const before1 = await ethers.provider.getBalance(user1.address);
    await distributor.connect(user1).withdrawRent();
    const after1 = await ethers.provider.getBalance(user1.address);
    expect(after1).to.be.gt(before1);

    // user2 withdraws
    const before2 = await ethers.provider.getBalance(user2.address);
    await distributor.connect(user2).withdrawRent();
    const after2 = await ethers.provider.getBalance(user2.address);
    expect(after2).to.be.gt(before2);
  });
});
