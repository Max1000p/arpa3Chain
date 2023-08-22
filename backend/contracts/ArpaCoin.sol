// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract ArpaCoin is ERC20, Ownable {
    constructor() ERC20("ARPACOIN", "APCoin") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount* 10**18);
    }



}