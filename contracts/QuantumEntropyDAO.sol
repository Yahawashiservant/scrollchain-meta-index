// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuantumEntropyDAO {
  struct E { uint ts; string q; string note; address by; }
  mapping(uint=>E) public trails; uint public count;
  event Logged(uint id, string q, string note, address by);

  function log(string calldata q, string calldata note) external returns(uint){
    count++;
    trails[count] = E(block.timestamp, q, note, msg.sender);
    emit Logged(count, q, note, msg.sender);
    return count;
  }
}
