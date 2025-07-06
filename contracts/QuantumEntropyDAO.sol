// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuantumEntropyDAO {
  struct E { uint ts; string qh; string note; address by; }
  mapping(uint=>E) public trails;
  uint public count;

  event Logged(uint id, string qh, string note, address by);

  function log(string calldata qh, string calldata note) external returns(uint){
    uint id = ++count;
    trails[id]=E(block.timestamp,qh,note,msg.sender);
    emit Logged(id,qh,note,msg.sender);
    return id;
  }
}
