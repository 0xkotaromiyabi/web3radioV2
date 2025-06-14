
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title W3RRewards
 * @dev Smart contract for managing Web3 Radio listening rewards
 */
contract W3RRewards is Ownable, ReentrancyGuard, Pausable {
    IERC20 public w3rToken;
    
    // Constants
    uint256 public constant REWARD_INTERVAL = 3600; // 1 hour in seconds
    uint256 public constant REWARD_AMOUNT = 100 * 10**18; // 100 W3R tokens
    uint256 public constant MAX_DAILY_REWARDS = 24; // Maximum rewards per day
    
    // User data structure
    struct UserData {
        uint256 totalListeningTime;
        uint256 lastRewardClaim;
        uint256 dailyRewardsClaimed;
        uint256 lastDayReset;
        bool isActive;
    }
    
    // Mappings
    mapping(address => UserData) public users;
    mapping(address => bool) public authorizedUpdaters;
    
    // Events
    event ListeningTimeUpdated(address indexed user, uint256 newTime);
    event RewardClaimed(address indexed user, uint256 amount);
    event AuthorizedUpdaterSet(address indexed updater, bool authorized);
    
    // Modifiers
    modifier onlyAuthorizedUpdater() {
        require(authorizedUpdaters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor(address _w3rToken) {
        w3rToken = IERC20(_w3rToken);
        authorizedUpdaters[msg.sender] = true;
    }
    
    /**
     * @dev Update user's listening time (called by backend oracle)
     * @param user Address of the user
     * @param timeToAdd Additional listening time in seconds
     */
    function updateListeningTime(address user, uint256 timeToAdd) 
        external 
        onlyAuthorizedUpdater 
        whenNotPaused 
    {
        require(user != address(0), "Invalid address");
        require(timeToAdd > 0, "Time must be positive");
        
        UserData storage userData = users[user];
        userData.totalListeningTime += timeToAdd;
        userData.isActive = true;
        
        emit ListeningTimeUpdated(user, userData.totalListeningTime);
    }
    
    /**
     * @dev Check if user is eligible for reward
     * @param user Address to check
     */
    function isRewardEligible(address user) public view returns (bool) {
        UserData memory userData = users[user];
        
        if (!userData.isActive) return false;
        
        // Reset daily counter if new day
        if (block.timestamp >= userData.lastDayReset + 86400) {
            return userData.totalListeningTime >= REWARD_INTERVAL;
        }
        
        // Check if user hasn't exceeded daily limit
        if (userData.dailyRewardsClaimed >= MAX_DAILY_REWARDS) return false;
        
        // Check if enough time has passed since last claim
        uint256 timeSinceLastClaim = block.timestamp - userData.lastRewardClaim;
        if (timeSinceLastClaim < REWARD_INTERVAL) return false;
        
        // Check if user has enough listening time
        return userData.totalListeningTime >= REWARD_INTERVAL;
    }
    
    /**
     * @dev Calculate next reward time for user
     * @param user Address to check
     */
    function getNextRewardTime(address user) public view returns (uint256) {
        UserData memory userData = users[user];
        
        if (!userData.isActive) return 0;
        
        uint256 nextRewardTime = userData.lastRewardClaim + REWARD_INTERVAL;
        return nextRewardTime > block.timestamp ? nextRewardTime - block.timestamp : 0;
    }
    
    /**
     * @dev Claim reward tokens
     */
    function claimReward() external nonReentrant whenNotPaused {
        require(isRewardEligible(msg.sender), "Not eligible for reward");
        
        UserData storage userData = users[msg.sender];
        
        // Reset daily counter if new day
        if (block.timestamp >= userData.lastDayReset + 86400) {
            userData.dailyRewardsClaimed = 0;
            userData.lastDayReset = block.timestamp;
        }
        
        // Update user data
        userData.lastRewardClaim = block.timestamp;
        userData.dailyRewardsClaimed++;
        userData.totalListeningTime -= REWARD_INTERVAL; // Deduct used time
        
        // Transfer reward tokens
        require(w3rToken.transfer(msg.sender, REWARD_AMOUNT), "Token transfer failed");
        
        emit RewardClaimed(msg.sender, REWARD_AMOUNT);
    }
    
    /**
     * @dev Get user data
     * @param user Address to query
     */
    function getUserData(address user) external view returns (
        uint256 totalListeningTime,
        uint256 lastRewardClaim,
        uint256 dailyRewardsClaimed,
        bool isActive
    ) {
        UserData memory userData = users[user];
        return (
            userData.totalListeningTime,
            userData.lastRewardClaim,
            userData.dailyRewardsClaimed,
            userData.isActive
        );
    }
    
    /**
     * @dev Set authorized updater (only owner)
     * @param updater Address to authorize/deauthorize
     * @param authorized Whether the address is authorized
     */
    function setAuthorizedUpdater(address updater, bool authorized) external onlyOwner {
        authorizedUpdaters[updater] = authorized;
        emit AuthorizedUpdaterSet(updater, authorized);
    }
    
    /**
     * @dev Emergency withdraw tokens (only owner)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(w3rToken.transfer(owner(), amount), "Transfer failed");
    }
    
    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return w3rToken.balanceOf(address(this));
    }
}
