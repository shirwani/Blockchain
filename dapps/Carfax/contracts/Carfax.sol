pragma solidity ^0.4.8;

contract Carfax{
	struct Car{
		string make;
		string model;
		uint year;
		string imgurl;	// image file saved on ipfs
		bytes32[] reports;
	}
	mapping (bytes32 => Report) report; // report[reportId] -> Report
	mapping (bytes32 => Car) car; // car[vin] -> Car
	bytes32[] public vins;

	struct Report{
		string reporttype;
		uint datetime;
		string reporturl; // report details saved on ipfs
	}

    function add_car(bytes32 vin, string make, string model, uint year, string imgurl) public{
		car[vin].make 	= make;
		car[vin].model 	= model;
		car[vin].year 	= year;
		car[vin].imgurl = imgurl;
		vins.push(vin);
    }

	function get_car_details(bytes32 vin) public returns (string make, string model, uint year, string imgurl, bytes32[] reports){
		make 	= car[vin].make;
		model 	= car[vin].model;
		year 	= car[vin].year;
		imgurl  = car[vin].imgurl;
		reports = get_car_reports(vin);
	}

    function get_cars_list() public returns (bytes32[]){
    	return vins;
    }

    function add_report_to_car(bytes32 vin, bytes32 reportId, string reporttype, uint datetime, string reporturl) public{
		car[vin].reports.push(reportId);
		report[reportId] = Report({reporttype:reporttype , datetime:datetime, reporturl:reporturl});
    }

    function get_car_reports(bytes32 vin) public returns (bytes32[]){
    	return car[vin].reports;
    }

    function get_report_details(bytes32 reportId) public returns (string reporttype, uint datetime, string reporturl){
    	reporttype 	= report[reportId].reporttype;
    	datetime 	= report[reportId].datetime;
    	reporturl 	= report[reportId].reporturl;
    }
}

