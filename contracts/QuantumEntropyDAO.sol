// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QDAO {
  struct E { uint ts; string q; string n; address by; }
  mapping(uint => E) public t;
  uint public c;
  event L(uint id, string q, string n, address by);

  // batch‐log 369 amplified entries
  function logBatch(string[] calldata qs, string[] calldata ns) external returns (uint) {
    require(qs.length == 369 && ns.length == 369, "batch must be 369");
    for (uint i = 0; i < 369; i++) {
      c++;
      t[c] = E(block.timestamp, qs[i], ns[i], msg.sender);
      emit L(c, qs[i], ns[i], msg.sender);
    }
    return c;
  }
}
