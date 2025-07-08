
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SovereignAnnuitySystem is ERC721URIStorage, Ownable {
    struct Annuity {
        uint256 principal;
        uint256 monthlyPayout;
        uint256 lastClaimed;
        uint256 inflationRate; // basis points (e.g. 250 = 2.5%)
        uint256 entropySignal; // AI-indexed modifier
        address beneficiary;
        bool active;
    }

    uint256 public nextTokenId;
    mapping(uint256 => Annuity) public annuities;
    mapping(address => uint256[]) public ownedAnnuities;

    event AnnuityIssued(address indexed to, uint256 tokenId, uint256 principal);
    event PayoutClaimed(address indexed by, uint256 tokenId, uint256 amount);
    event InflationUpdated(uint256 tokenId, uint256 newRate);
    event EntropySignalUpdated(uint256 tokenId, uint256 signal);
    event RedemptionProposed(uint256 tokenId, uint256 amount);
    event InheritanceProposed(uint256 tokenId, address heir);

    constructor() ERC721("SovereignYieldScroll", "SYS") Ownable(msg.sender) {}

    function issueAnnuity(
        address to,
        uint256 principal,
        uint256 monthlyPayout,
        string memory tokenURI
    ) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        annuities[tokenId] = Annuity({
            principal: principal,
            monthlyPayout: monthlyPayout,
            lastClaimed: block.timestamp,
            inflationRate: 0,
            entropySignal: 10000, // baseline 1.0x
            beneficiary: to,
            active: true
        });

        ownedAnnuities[to].push(tokenId);
        emit AnnuityIssued(to, tokenId, principal);
    }

    function claimPayout(uint256 tokenId) external {
        Annuity storage a = annuities[tokenId];
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(a.active, "Inactive");
        require(block.timestamp >= a.lastClaimed + 30 days, "Too soon");

        uint256 adjustedPayout = a.monthlyPayout;
        adjustedPayout += (adjustedPayout * a.inflationRate) / 10000;
        adjustedPayout = (adjustedPayout * a.entropySignal) / 10000;

        a.lastClaimed = block.timestamp;
        emit PayoutClaimed(msg.sender, tokenId, adjustedPayout);
        // In production: transfer stablecoin or kernel-backed asset
    }
function getEntropicMultiplier(uint256 tokenId) public view returns (uint256) {
    bytes32 entropyHash = keccak256(abi.encodePacked(
        annuities[tokenId].entropySignal,
        annuities[tokenId].lastClaimed,
        block.timestamp
    ));
    return uint256(entropyHash) % 500 + 9750; // 97.5%–102.5%
}

    function setInflationRate(uint256 tokenId, uint256 rate) external onlyOwner {
        annuities[tokenId].inflationRate = rate;
        emit InflationUpdated(tokenId, rate);
    }

    function setEntropySignal(uint256 tokenId, uint256 signal) external onlyOwner {
        annuities[tokenId].entropySignal = signal;
        emit EntropySignalUpdated(tokenId, signal);
    }

    function proposeRedemption(uint256 tokenId, uint256 amount) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        emit RedemptionProposed(tokenId, amount);
        // DAO logic would ratify and execute
    }

    function proposeInheritance(uint256 tokenId, address heir) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        emit InheritanceProposed(tokenId, heir);
        // DAO logic would ratify and transfer
    }
    function generateSigil(uint256 tokenId) public view returns (bytes32) {
    return keccak256(abi.encodePacked(
        ownerOf(tokenId),
        tokenId,
        tokenURI(tokenId)
    ));
}

}
