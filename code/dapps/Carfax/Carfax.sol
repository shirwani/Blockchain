pragma solidity ^0.4.8;

contract Carfax{
	struct Car{
		string vinNumber;
		uint numReports;
	}
	uint numCars;
	mapping (string => Car) car;
	string[] public cars;

    function Carfax() public{
    	numCars = 0;
    }

    function addCar(string vin) public{
		car[vin].vinNumber = vin;
		car[vin].numReports = 0;
		cars.push(vin);
    }

    function addEvent(string vin) public{
		car[vin].numReports++;
    }

    function getNumEvents(string vin) public returns (uint){
        return car[vin].numReports;
    }

    function getNumCars() public returns (uint){
    	return cars.length;
    }

    function getCar(uint idx) public returns (string){
    	return cars[idx];
    }
}

