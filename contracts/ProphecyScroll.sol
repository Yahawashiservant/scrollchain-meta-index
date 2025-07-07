// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProphecyScroll {
    event ProphecySubmitted(address indexed prophet, string message, uint256 timestamp);

    function submitProphecy(string calldata message) external {
        emit ProphecySubmitted(msg.sender, message, block.timestamp);
    }
}