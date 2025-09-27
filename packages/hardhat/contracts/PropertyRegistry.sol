// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract PropertyRegistry is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Property {
        uint256 id;
        address owner;
        uint256 value;
        uint256 totalFractions;
        string metadataURI;
        bool verified;
        bool active;
    }

    mapping(uint256 => Property) private properties;
    uint256 public nextPropertyId;

    event PropertyRegistered(
        uint256 indexed id,
        address indexed owner,
        uint256 value,
        uint256 totalFractions,
        string uri
    );
    event PropertyVerified(uint256 indexed id, bool verified);
    event PropertyTransferred(
        uint256 indexed id,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 value
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function registerProperty(
        uint256 value,
        uint256 totalFractions,
        string calldata metadataURI
    ) external whenNotPaused returns (uint256) {
        uint256 id = nextPropertyId++;

        properties[id] = Property({
            id: id,
            owner: msg.sender,
            value: value,
            totalFractions: totalFractions,
            metadataURI: metadataURI,
            verified: false,
            active: true
        });

        emit PropertyRegistered(id, msg.sender, value, totalFractions, metadataURI);
        return id;
    }

    function verifyProperty(uint256 propertyId, bool status)
        external
        onlyRole(ADMIN_ROLE)
    {
        properties[propertyId].verified = status;
        emit PropertyVerified(propertyId, status);
    }

    function getProperty(uint256 propertyId)
        external
        view
        returns (Property memory)
    {
        return properties[propertyId];
    }

    function finalizeSale(uint256 propertyId, address newOwner, uint256 price)
        external
        whenNotPaused
        onlyRole(ADMIN_ROLE)
    {
        Property storage prop = properties[propertyId];
        require(prop.active, "Inactive");

        address oldOwner = prop.owner;
        prop.owner = newOwner;

        emit PropertyTransferred(propertyId, oldOwner, newOwner, price);
    }

    // 🔒 Emergency controls
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
