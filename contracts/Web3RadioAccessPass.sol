// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ERC-4907 Minimal Interface
 */
interface IERC4907 {
    event UpdateUser(
        uint256 indexed tokenId,
        address indexed user,
        uint64 expires
    );
    function setUser(uint256 tokenId, address user, uint64 expires) external;
    function userOf(uint256 tokenId) external view returns (address);
}

/**
 * Web3Radio Access Pass
 * Time-based access protocol
 */
contract Web3RadioAccessPass is ERC721, Ownable, IERC4907 {
    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant REGULAR_SUPPLY = 168; // 7 days * 24 hours
    uint256 public constant SUPER_START_ID = 168;
    uint256 public constant SUPER_SUPPLY = 7;

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct TimeSlot {
        uint8 day; // 0 = Monday, 6 = Sunday
        uint8 hour; // 0 - 23
    }

    struct UserInfo {
        address user;
        uint64 expires;
    }

    struct SuperClaim {
        uint8 claimedHour;
        uint256 weekIndex;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    mapping(uint256 => TimeSlot) public timeSlots;
    mapping(uint256 => UserInfo) internal _users;
    mapping(uint256 => SuperClaim) public superClaims;

    bool public accessPaused;

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address initialOwner
    ) ERC721("Web3Radio Access Pass", "W3R-ACCESS") Ownable(initialOwner) {
        // Mint Regular Access (168 hours)
        for (uint8 d = 0; d < 7; d++) {
            for (uint8 h = 0; h < 24; h++) {
                uint256 tokenId = d * 24 + h;
                _mint(initialOwner, tokenId);
                timeSlots[tokenId] = TimeSlot(d, h);
            }
        }

        // Mint Super Access (7 days)
        for (uint8 i = 0; i < SUPER_SUPPLY; i++) {
            _mint(initialOwner, SUPER_START_ID + i);
        }
    }

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier whenAccessActive() {
        require(!accessPaused, "Access paused");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                            ERC-4907 LOGIC
    //////////////////////////////////////////////////////////////*/

    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) external override {
        require(
            _isAuthorized(ownerOf(tokenId), msg.sender, tokenId),
            "Not owner nor approved"
        );
        _users[tokenId] = UserInfo(user, expires);
        emit UpdateUser(tokenId, user, expires);
    }

    function userOf(uint256 tokenId) public view override returns (address) {
        if (_users[tokenId].expires >= block.timestamp) {
            return _users[tokenId].user;
        }
        return address(0);
    }

    function effectiveHolder(uint256 tokenId) public view returns (address) {
        address user = userOf(tokenId);
        return user != address(0) ? user : ownerOf(tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                        SUPER ACCESS LOGIC
    //////////////////////////////////////////////////////////////*/

    function isSuper(uint256 tokenId) public pure returns (bool) {
        return
            tokenId >= SUPER_START_ID &&
            tokenId < SUPER_START_ID + SUPER_SUPPLY;
    }

    function currentWeekIndex() public view returns (uint256) {
        // Absolute week index based on hours (168 hours = 1 week)
        return (block.timestamp / 1 hours) / 168;
    }

    function claimSuperHour(
        uint256 tokenId,
        uint8 hour
    ) external whenAccessActive {
        require(isSuper(tokenId), "Not super access");
        require(hour < 24, "Invalid hour");

        address holder = effectiveHolder(tokenId);
        require(msg.sender == holder, "Not authorized");

        uint256 weekIndex = currentWeekIndex();
        SuperClaim storage claim = superClaims[tokenId];

        require(claim.weekIndex < weekIndex, "Already claimed this week");

        claim.claimedHour = hour;
        claim.weekIndex = weekIndex;
    }

    /*//////////////////////////////////////////////////////////////
                        ACCESS VALIDATION
    //////////////////////////////////////////////////////////////*/

    function hasRegularAccess(address wallet) public view returns (bool) {
        uint256 currentHour = block.timestamp / 1 hours;
        uint8 hour = uint8(currentHour % 24);
        uint8 day = uint8((currentHour / 24 + 3) % 7); // Monday = 0

        uint256 tokenId = day * 24 + hour;
        return effectiveHolder(tokenId) == wallet;
    }

    function hasSuperAccess(address wallet) public view returns (bool) {
        uint256 currentHour = block.timestamp / 1 hours;
        uint8 hour = uint8(currentHour % 24);
        uint8 day = uint8((currentHour / 24 + 3) % 7);

        uint256 tokenId = SUPER_START_ID + day;
        if (!isSuper(tokenId)) return false;

        if (effectiveHolder(tokenId) != wallet) return false;

        SuperClaim memory claim = superClaims[tokenId];
        return
            claim.weekIndex == currentWeekIndex() && claim.claimedHour == hour;
    }

    function hasAccessNow(
        address wallet
    ) external view whenAccessActive returns (bool) {
        return hasRegularAccess(wallet) || hasSuperAccess(wallet);
    }

    /*//////////////////////////////////////////////////////////////
                            ADMIN
    //////////////////////////////////////////////////////////////*/

    function pauseAccess(bool paused) external onlyOwner {
        accessPaused = paused;
    }
}
