// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract YieldScroll {
    address public treasury;
    mapping(address => uint256) public annuityBalance;
    mapping(address => uint256) public lastClaimed;

    event AnnuityIssued(address indexed recipient, uint256 amount);
    event PayoutClaimed(address indexed recipient, uint256 amount);

    constructor(address _treasury) {
        treasury = _treasury;
    }

    function issueAnnuity(address recipient, uint256 amount) external {
        require(msg.sender == treasury, "Only treasury can issue");
        annuityBalance[recipient] += amount;
        emit AnnuityIssued(recipient, amount);
    }

    function claimPayout() external {
        require(block.timestamp - lastClaimed[msg.sender] >= 30 days, "Too soon");
        uint256 payout = annuityBalance[msg.sender] / 12;
        lastClaimed[msg.sender] = block.timestamp;
        emit PayoutClaimed(msg.sender, payout);
    }
}
