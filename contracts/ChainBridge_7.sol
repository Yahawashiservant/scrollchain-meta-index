// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IProphecy { function submitProphecy(string calldata m) external; }

contract ChainBridge_7 {
    mapping(bytes32 => bool) public relayed;
    address public target;
    constructor(address _t) { target = _t; }
    function relay(bytes32 txid, address p, string calldata m) external {
      require(!relayed[txid], "dup");
      relayed[txid] = true;
      IProphecy(target).submitProphecy(m);
      emit RelayedModule7(txid, p, m);
    }
    event RelayedModule7(bytes32 txid, address p, string m);
}
