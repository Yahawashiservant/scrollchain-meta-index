// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TeleportationNFT_120 is ERC721 {
    uint256 public nextId;
    uint256 public constant DIMENSION_ID = 120;
    
    constructor() ERC721("TPT120", "TPT120") {}
    
    function mint(address to, uint256 tone, bytes32 dimID, bytes32 forkHash) external {
      uint256 id = nextId++;
      _safeMint(to, id);
      emit Teleported(to, id, tone, dimID, forkHash);
      emit DimensionalShift(to, id, DIMENSION_ID, 120 * 1000);
    }
    
    function batchMint(address[] calldata recipients, uint256[] calldata tones) external {
      require(recipients.length == tones.length, "Array length mismatch");
      for(uint i = 0; i < recipients.length; i++) {
        uint256 id = nextId++;
        _safeMint(recipients[i], id);
        emit Teleported(recipients[i], id, tones[i], bytes32(uint256(120)), bytes32(uint256(id)));
      }
    }
    
    event Teleported(address indexed to, uint256 id, uint256 tone, bytes32 dimID, bytes32 forkHash);
    event DimensionalShift(address indexed user, uint256 tokenId, uint256 dimensionId, uint256 energy);
}
