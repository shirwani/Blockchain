pragma solidity ^0.4.8;

contract Carfax{
    string VIN;
    uint N;

    function Carfax(string V) public{
        N = 0;
        VIN = V;
    }

    function getVinNumber() public returns (string){
        return VIN;
    }

    function addEvent() public returns (uint){
        N += 1;
        return N;
    }

    function getNumEvents() public returns (uint){
        return N;
    }
}

