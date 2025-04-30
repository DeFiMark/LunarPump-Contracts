//SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IDatabase {
    function isBonded(address token) external view returns (bool);
    function isLunarPumpToken(address token) external view returns (bool);
    function getLunarPumpTokenMasterCopy() external view returns (address);
    function getBondingCurveMasterCopy() external view returns (address);
    function getBondingCurveForToken(address token) external view returns (address);
    function getLiquidityLocker() external view returns (address);
    function getFeeRecipient() external view returns (address);
    function bondProject() external;
    function registerVolume(address user, uint256 amount) external;
    function getLunarPumpGenerator() external view returns (address);
}