// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProphecyScroll {
    string public ipfsCID;

    event ScrollBound(address indexed binder, string cid);

    function bindCID(string calldata cid) external {
        ipfsCID = cid;
        emit ScrollBound(msg.sender, cid);
    }
}
