// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract ArpaToken is ERC20, Ownable {
    constructor() ERC20("ArpaToken", "ARPACOIN") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount* 10**18);
    }
}