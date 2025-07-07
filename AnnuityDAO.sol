// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AnnuityDAO {
    address public founder;
    mapping(address => uint256) public votingPower;
    string public currentYieldPolicy;

    event PolicyProposed(string scrollCID);
    event VoteCast(address voter, uint256 weight);
    event PolicyRatified(string scrollCID);

    constructor() {
        founder = msg.sender;
    }

    function proposePolicy(string calldata scrollCID) external {
        emit PolicyProposed(scrollCID);
    }

    function vote(string calldata scrollCID, uint256 weight) external {
        votingPower[msg.sender] += weight;
        emit VoteCast(msg.sender, weight);
        if (votingPower[msg.sender] > 1000) {
            currentYieldPolicy = scrollCID;
            emit PolicyRatified(scrollCID);
        }
    }
}
