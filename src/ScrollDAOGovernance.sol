
// SPDX-License-Identifier: MIT
// SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
// ScrollEntropy DAO Governance - Production Contract
// Author: Keith D. Whitfield — ScrollChain Architect

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ScrollEntropyToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1M tokens
    
    constructor() ERC20("ScrollEntropy", "SCROLL") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract ScrollEntropyDAO is ReentrancyGuard {
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 votingStartTime;
        uint256 votingEndTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voteWeight;
    }
    
    struct AgentLicenseProposal {
        uint256 proposalId;
        uint256 agentTokenId;
        address licensee;
        uint256 royaltyRate;
        uint256 duration;
        uint256 licensePrice;
    }
    
    ScrollEntropyToken public scrollToken;
    address public scrollNFTContract;
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => AgentLicenseProposal) public licenseProposals;
    uint256 public proposalCount;
    
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant PROPOSAL_THRESHOLD = 1000 * 10**18; // 1000 SCROLL tokens
    uint256 public constant QUORUM = 5000 * 10**18; // 5000 SCROLL tokens
    
    address public treasury;
    mapping(address => uint256) public stakedTokens;
    mapping(address => uint256) public votingPower;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 votingStartTime,
        uint256 votingEndTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    
    constructor(address _scrollToken, address _scrollNFT, address _treasury) {
        scrollToken = ScrollEntropyToken(_scrollToken);
        scrollNFTContract = _scrollNFT;
        treasury = _treasury;
    }
    
    function stakeTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(scrollToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        stakedTokens[msg.sender] += amount;
        votingPower[msg.sender] += amount;
        
        emit TokensStaked(msg.sender, amount);
    }
    
    function unstakeTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedTokens[msg.sender] >= amount, "Insufficient staked tokens");
        
        stakedTokens[msg.sender] -= amount;
        votingPower[msg.sender] -= amount;
        
        require(scrollToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit TokensUnstaked(msg.sender, amount);
    }
    
    function createProposal(
        string memory title,
        string memory description
    ) public returns (uint256) {
        require(
            scrollToken.balanceOf(msg.sender) >= PROPOSAL_THRESHOLD,
            "Insufficient tokens to create proposal"
        );
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.votingStartTime = block.timestamp;
        proposal.votingEndTime = block.timestamp + VOTING_PERIOD;
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            title,
            proposal.votingStartTime,
            proposal.votingEndTime
        );
        
        return proposalId;
    }
    
    function createAgentLicenseProposal(
        uint256 agentTokenId,
        address licensee,
        uint256 royaltyRate,
        uint256 duration,
        uint256 licensePrice
    ) public returns (uint256) {
        string memory title = string(abi.encodePacked("Agent License - Token ID: ", agentTokenId));
        string memory description = string(abi.encodePacked(
            "Proposal to license agent with ",
            royaltyRate,
            "% royalty for ",
            duration,
            " seconds"
        ));
        
        uint256 proposalId = createProposal(title, description);
        
        licenseProposals[proposalId] = AgentLicenseProposal({
            proposalId: proposalId,
            agentTokenId: agentTokenId,
            licensee: licensee,
            royaltyRate: royaltyRate,
            duration: duration,
            licensePrice: licensePrice
        });
        
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id == proposalId, "Proposal does not exist");
        require(block.timestamp >= proposal.votingStartTime, "Voting has not started");
        require(block.timestamp <= proposal.votingEndTime, "Voting has ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voteWeight[msg.sender] = votingPower[msg.sender];
        
        if (support) {
            proposal.forVotes += votingPower[msg.sender];
        } else {
            proposal.againstVotes += votingPower[msg.sender];
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower[msg.sender]);
    }
    
    function executeProposal(uint256 proposalId) public nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id == proposalId, "Proposal does not exist");
        require(block.timestamp > proposal.votingEndTime, "Voting has not ended");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.canceled, "Proposal was canceled");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        require(totalVotes >= QUORUM, "Quorum not reached");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        
        proposal.executed = true;
        
        // Execute license proposal if it exists
        AgentLicenseProposal storage licenseProposal = licenseProposals[proposalId];
        if (licenseProposal.proposalId == proposalId) {
            // In a real implementation, this would call the NFT contract's license function
            // For now, we'll emit an event
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    function getProposal(uint256 proposalId) public view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        uint256 votingStartTime,
        uint256 votingEndTime,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        bool canceled
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.votingStartTime,
            proposal.votingEndTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed,
            proposal.canceled
        );
    }
    
    function hasVoted(uint256 proposalId, address voter) public view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }
    
    function getVotingPower(address user) public view returns (uint256) {
        return votingPower[user];
    }
    
    function getStakedTokens(address user) public view returns (uint256) {
        return stakedTokens[user];
    }
}
