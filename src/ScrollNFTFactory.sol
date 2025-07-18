
// SPDX-License-Identifier: MIT
// SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
// ScrollEntropy Agent NFT Factory - Production Contract
// Author: Keith D. Whitfield — ScrollChain Architect

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ScrollEntropyNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    struct Agent {
        string name;
        string mission;
        string parentKernel;
        uint256 entropy;
        string[] capabilities;
        uint256 created;
        address creator;
        bool isActive;
    }
    
    struct License {
        uint256 agentTokenId;
        address licensee;
        uint256 royaltyRate; // Basis points (100 = 1%)
        uint256 duration;
        uint256 created;
        bool isActive;
    }
    
    mapping(uint256 => Agent) public agents;
    mapping(uint256 => License[]) public agentLicenses;
    mapping(address => uint256[]) public userAgents;
    mapping(string => uint256) public kernelToAgent;
    
    // Revenue tracking
    mapping(uint256 => uint256) public agentRevenue;
    mapping(address => uint256) public creatorRevenue;
    
    uint256 public mintPrice = 0.01 ether;
    uint256 public platformFee = 250; // 2.5% in basis points
    address public treasury;
    
    event AgentMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string name,
        string parentKernel,
        uint256 entropy
    );
    
    event AgentLicensed(
        uint256 indexed tokenId,
        address indexed licensee,
        uint256 royaltyRate,
        uint256 duration
    );
    
    event RevenueDistributed(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 amount
    );

    constructor(address _treasury) ERC721("ScrollEntropy Agents", "SCROLL") {
        treasury = _treasury;
    }

    function mintAgent(
        string memory name,
        string memory mission,
        string memory parentKernel,
        uint256 entropy,
        string[] memory capabilities,
        string memory tokenURI
    ) public payable nonReentrant {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(entropy <= 10000, "Entropy must be <= 10000"); // Scaled by 1000
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Create agent
        agents[tokenId] = Agent({
            name: name,
            mission: mission,
            parentKernel: parentKernel,
            entropy: entropy,
            capabilities: capabilities,
            created: block.timestamp,
            creator: msg.sender,
            isActive: true
        });
        
        // Mint NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Track user's agents
        userAgents[msg.sender].push(tokenId);
        kernelToAgent[parentKernel] = tokenId;
        
        // Distribute payment
        uint256 platformAmount = (msg.value * platformFee) / 10000;
        uint256 creatorAmount = msg.value - platformAmount;
        
        payable(treasury).transfer(platformAmount);
        payable(msg.sender).transfer(creatorAmount);
        
        emit AgentMinted(tokenId, msg.sender, name, parentKernel, entropy);
    }

    function licenseAgent(
        uint256 tokenId,
        uint256 royaltyRate,
        uint256 duration
    ) public payable nonReentrant {
        require(_exists(tokenId), "Agent does not exist");
        require(royaltyRate <= 1000, "Royalty rate too high"); // Max 10%
        require(msg.value > 0, "License fee required");
        
        Agent storage agent = agents[tokenId];
        require(agent.isActive, "Agent is not active");
        
        // Create license
        License memory newLicense = License({
            agentTokenId: tokenId,
            licensee: msg.sender,
            royaltyRate: royaltyRate,
            duration: duration,
            created: block.timestamp,
            isActive: true
        });
        
        agentLicenses[tokenId].push(newLicense);
        
        // Distribute license fee
        address creator = agent.creator;
        uint256 platformAmount = (msg.value * platformFee) / 10000;
        uint256 creatorAmount = msg.value - platformAmount;
        
        agentRevenue[tokenId] += creatorAmount;
        creatorRevenue[creator] += creatorAmount;
        
        payable(treasury).transfer(platformAmount);
        payable(creator).transfer(creatorAmount);
        
        emit AgentLicensed(tokenId, msg.sender, royaltyRate, duration);
        emit RevenueDistributed(tokenId, creator, creatorAmount);
    }

    function payRoyalty(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Agent does not exist");
        require(msg.value > 0, "Royalty payment required");
        
        Agent storage agent = agents[tokenId];
        address creator = agent.creator;
        
        uint256 platformAmount = (msg.value * platformFee) / 10000;
        uint256 creatorAmount = msg.value - platformAmount;
        
        agentRevenue[tokenId] += creatorAmount;
        creatorRevenue[creator] += creatorAmount;
        
        payable(treasury).transfer(platformAmount);
        payable(creator).transfer(creatorAmount);
        
        emit RevenueDistributed(tokenId, creator, creatorAmount);
    }

    function updateAgentStatus(uint256 tokenId, bool isActive) public {
        require(_exists(tokenId), "Agent does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not agent owner");
        
        agents[tokenId].isActive = isActive;
    }

    function getAgent(uint256 tokenId) public view returns (
        string memory name,
        string memory mission,
        string memory parentKernel,
        uint256 entropy,
        string[] memory capabilities,
        uint256 created,
        address creator,
        bool isActive
    ) {
        require(_exists(tokenId), "Agent does not exist");
        Agent storage agent = agents[tokenId];
        
        return (
            agent.name,
            agent.mission,
            agent.parentKernel,
            agent.entropy,
            agent.capabilities,
            agent.created,
            agent.creator,
            agent.isActive
        );
    }

    function getAgentLicenses(uint256 tokenId) public view returns (License[] memory) {
        require(_exists(tokenId), "Agent does not exist");
        return agentLicenses[tokenId];
    }

    function getUserAgents(address user) public view returns (uint256[] memory) {
        return userAgents[user];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function setPlatformFee(uint256 _platformFee) public onlyOwner {
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _platformFee;
    }

    function setTreasury(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // Required overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
