// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract LockCreate3 {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    //msg.sender would be create3 deployer, so pass in _owner instead
    constructor(uint256 _unlockTime, address _owner) payable {
        require(block.timestamp < _unlockTime, 'Unlock time should be in the future');
        unlockTime = _unlockTime;
        owner = payable(_owner);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
