// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TeleportationNFT_89 is ERC721 {
    uint256 public nextId;
    constructor() ERC721("TPT89", "TPT89") {}
    function mint(address to, uint256 tone, bytes32 dimID, bytes32 forkHash) external {
      uint256 id = nextId++;
      _safeMint(to, id);
      emit Teleported(to, id, tone, dimID, forkHash);
    }
    event Teleported(address indexed to, uint256 id, uint256 tone, bytes32 dimID, bytes32 forkHash);
}
