//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface ILiquidityAdder {
    function bond(address token) external payable;
    function getFeeRecipient() external view returns (address);
    function getDatabase() external view returns (address);
}