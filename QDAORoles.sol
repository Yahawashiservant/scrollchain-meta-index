// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract QDAORoles {
    mapping(address => string) public roles;

    event RoleAssigned(address indexed user, string role);

    function assignRole(address user, string calldata role) external {
        roles[user] = role;
        emit RoleAssigned(user, role);
    }
}