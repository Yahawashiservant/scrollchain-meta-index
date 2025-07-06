// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScrollBotKernelRegistry {
  struct BotKernel {
    uint ts;
    string sigilHash;
    string entropyHash;
    string functionSet;
    address registeredBy;
  }

  mapping(uint => BotKernel) public bots;
  uint public count;

  event BotRegistered(uint id, string sigilHash, string entropyHash, string functionSet, address registeredBy);

  function register(string calldata sigilHash, string calldata entropyHash, string calldata functionSet) external returns (uint) {
    uint id = ++count;
    bots[id] = BotKernel(block.timestamp, sigilHash, entropyHash, functionSet, msg.sender);
    emit BotRegistered(id, sigilHash, entropyHash, functionSet, msg.sender);
    return id;
  }
}
