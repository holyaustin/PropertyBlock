// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PropertyRegistry.sol";

contract Marketplace is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    PropertyRegistry public immutable registry;
    address public immutable treasury;

    uint256 public feeBps = 50; // 0.5%

    struct Listing {
        uint256 propertyId;
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    event PropertyListed(uint256 indexed propertyId, address indexed seller, uint256 price);
    event PropertySold(uint256 indexed propertyId, address indexed buyer, uint256 price, uint256 fee);
    event FeeUpdated(uint256 oldFee, uint256 newFee);

    constructor(address _registry, address _treasury, address admin) {
        registry = PropertyRegistry(_registry);
        treasury = _treasury;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function updateFee(uint256 newFee) external onlyRole(ADMIN_ROLE) {
        require(newFee <= 500, "Fee too high");
        emit FeeUpdated(feeBps, newFee);
        feeBps = newFee;
    }

    function listProperty(uint256 propertyId, uint256 price) external {
        PropertyRegistry.Property memory prop = registry.getProperty(propertyId);
        require(prop.owner == msg.sender, "Not owner");
        require(prop.active, "Inactive");
        require(prop.verified, "Property not verified");

        listings[propertyId] = Listing(propertyId, msg.sender, price, true);
        emit PropertyListed(propertyId, msg.sender, price);
    }

    function buyProperty(uint256 propertyId) external payable nonReentrant {
        Listing storage listing = listings[propertyId];
        require(listing.active, "Not listed");
        require(msg.value == listing.price, "Incorrect ETH");

        uint256 fee = (msg.value * feeBps) / 10000;
        uint256 sellerAmount = msg.value - fee;

        (bool sentSeller, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(sentSeller, "Seller transfer failed");

        (bool sentTreasury, ) = payable(treasury).call{value: fee}("");
        require(sentTreasury, "Treasury transfer failed");

        listing.active = false;
        registry.finalizeSale(propertyId, msg.sender, msg.value);

        emit PropertySold(propertyId, msg.sender, msg.value, fee);
    }
}
