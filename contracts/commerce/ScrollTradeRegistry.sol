// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScrollTradeRegistry {
  struct Trade {
    uint ts;
    string sigilHash;
    string asset;
    string terms;
    address party;
  }

  mapping(uint => Trade) public trades;
  uint public count;

  event TradeLogged(uint id, string sigilHash, string asset, string terms, address party);

  function logTrade(string calldata sigilHash, string calldata asset, string calldata terms) external returns (uint) {
    uint id = ++count;
    trades[id] = Trade(block.timestamp, sigilHash, asset, terms, msg.sender);
    emit TradeLogged(id, sigilHash, asset, terms, msg.sender);
    return id;
  }
}
