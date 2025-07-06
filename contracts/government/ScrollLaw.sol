// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScrollLaw {
  struct Law {
    uint ts;
    string sigilHash;
    string clause;
    address enactedBy;
  }

  mapping(uint => Law) public laws;
  uint public count;

  event LawEnacted(uint id, string sigilHash, string clause, address enactedBy);

  function enact(string calldata sigilHash, string calldata clause) external returns (uint) {
    uint id = ++count;
    laws[id] = Law(block.timestamp, sigilHash, clause, msg.sender);
    emit LawEnacted(id, sigilHash, clause, msg.sender);
    return id;
  }
}
