// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./ETHprice.sol";

error onlyi_ownerFail();

contract FundMe {
    using ETHprice for uint256;

    uint256 constant MINUSD = 30 * 1e18;

    address[] s_Funders;
    mapping(address => uint256) s_FunderToAmount;

    address immutable i_owner;

    AggregatorV3Interface s_priceFeed;

    constructor(AggregatorV3Interface priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function Fund() public payable {
        require(msg.value.priceConvertor(s_priceFeed) > MINUSD, "Irani");
        s_FunderToAmount[msg.sender] = msg.value;
        s_Funders.push(msg.sender);
    }

    function Withdraw() public onlyOwner {
        // require(i_owner == msg.sender, "Onlyi_owner"); specified in modifier

        for (
            uint256 s_FundersIndex = 0;
            s_FundersIndex < s_Funders.length;
            s_FundersIndex++
        ) {
            s_FunderToAmount[s_Funders[s_FundersIndex]] = 0;
        }
        // // reseting array
        s_Funders = new address[](0);
        // // withdraw
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess= payable(msg.sender).send(address(this).balance);
        // require(sendSuccess , "sendFailed");
        // call
        (bool callsuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callsuccess, "call Failed");
    }

    modifier onlyOwner() {
        // require(i_owner == msg.sender, "Onlyi_owner");
        if (msg.sender != i_owner) revert onlyi_ownerFail();
        // Error thing up the contract
        _;
    }

    function Funders(uint256 index) public view returns (address) {
        return s_Funders[index];
    }

    function FunderToAmount(address _Funder) public view returns (uint256) {
        return s_FunderToAmount[_Funder];
    }

    function Owner() public view returns (address) {
        return i_owner;
    }

    function priceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    receive() external payable {
        Fund();
    }

    fallback() external payable {
        Fund();
    }
}
