// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IWeb3RadioAccessPass is IERC721 {
    function setUser(uint256 tokenId, address user, uint64 expires) external;
}

contract RentalMarketplace is ReentrancyGuard, Ownable {
    IWeb3RadioAccessPass public immutable accessPass;
    IERC20 public immutable usdc;

    struct Listing {
        address lender;
        uint256 pricePerHour; // in wei or USDC atoms
        uint256 maxDuration;
        bool isActive;
    }

    // tokenId => Listing
    mapping(uint256 => Listing) public listings;

    event ListingCreated(
        uint256 indexed tokenId,
        address indexed lender,
        uint256 pricePerHour,
        uint256 maxDuration
    );
    event ListingCancelled(uint256 indexed tokenId);
    event Rented(
        uint256 indexed tokenId,
        address indexed renter,
        uint256 hoursCount,
        uint256 totalPrice
    );

    constructor(
        address _accessPass,
        address _usdc,
        address _initialOwner
    ) Ownable(_initialOwner) {
        accessPass = IWeb3RadioAccessPass(_accessPass);
        usdc = IERC20(_usdc);
    }

    function createListing(
        uint256 tokenId,
        uint256 pricePerHour,
        uint256 maxDuration
    ) external {
        require(accessPass.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            accessPass.isApprovedForAll(msg.sender, address(this)) ||
                accessPass.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[tokenId] = Listing({
            lender: msg.sender,
            pricePerHour: pricePerHour,
            maxDuration: maxDuration,
            isActive: true
        });

        emit ListingCreated(tokenId, msg.sender, pricePerHour, maxDuration);
    }

    function cancelListing(uint256 tokenId) external {
        require(listings[tokenId].lender == msg.sender, "Not the lender");
        delete listings[tokenId];
        emit ListingCancelled(tokenId);
    }

    function rentWithETH(
        uint256 tokenId,
        uint256 hoursCount
    ) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing not active");
        require(
            hoursCount > 0 && hoursCount <= listing.maxDuration,
            "Invalid duration"
        );

        uint256 totalPrice = listing.pricePerHour * hoursCount;
        require(msg.value >= totalPrice, "Insufficient ETH");

        // Calculate expiry
        uint64 expires = uint64(block.timestamp + (hoursCount * 1 hours));

        // Set user on NFT
        accessPass.setUser(tokenId, msg.sender, expires);

        // Pay lender
        (bool success, ) = payable(listing.lender).call{value: totalPrice}("");
        require(success, "Transfer failed");

        // Refund excess ETH
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit Rented(tokenId, msg.sender, hoursCount, totalPrice);
    }

    function rentWithUSDC(
        uint256 tokenId,
        uint256 hoursCount
    ) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing not active");
        require(
            hoursCount > 0 && hoursCount <= listing.maxDuration,
            "Invalid duration"
        );

        uint256 totalPrice = listing.pricePerHour * hoursCount;

        // Transfer USDC from renter to lender
        require(
            usdc.transferFrom(msg.sender, listing.lender, totalPrice),
            "USDC transfer failed"
        );

        // Calculate expiry
        uint64 expires = uint64(block.timestamp + (hoursCount * 1 hours));

        // Set user on NFT
        accessPass.setUser(tokenId, msg.sender, expires);

        emit Rented(tokenId, msg.sender, hoursCount, totalPrice);
    }

    // Owner can withdraw stuck tokens/ETH if any (though logic transfers directly)
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawERC20(address token) external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
    }
}
