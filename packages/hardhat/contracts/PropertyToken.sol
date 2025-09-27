// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @title PropertyToken - ERC20 per-property fractional ownership
contract PropertyToken is ERC20Permit {
    address public immutable registry;
    uint256 public immutable propertyId;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 supply_,
        address owner_,
        address registry_,
        uint256 propertyId_
    ) ERC20(name_, symbol_) ERC20Permit(name_) {
        _mint(owner_, supply_);
        registry = registry_;
        propertyId = propertyId_;
    }
}
