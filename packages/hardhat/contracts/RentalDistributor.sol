// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RentalDistributor is ReentrancyGuard {
    IERC20 public immutable propertyToken;

    constructor(address _token) {
        propertyToken = IERC20(_token);
    }

    receive() external payable {}

    function withdrawRent() external nonReentrant {
        uint256 balance = address(this).balance;
        uint256 supply = propertyToken.totalSupply();
        require(supply > 0, "Invalid supply");

        uint256 userShare = (balance * propertyToken.balanceOf(msg.sender)) / supply;
        require(userShare > 0, "No rent available");

        (bool sent, ) = payable(msg.sender).call{value: userShare}("");
        require(sent, "ETH transfer failed");
    }
}
