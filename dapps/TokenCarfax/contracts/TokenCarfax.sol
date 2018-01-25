pragma solidity ^0.4.8;

contract TokenCarfax{
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

    // TOKEN MANAGEMENT CODE BELOW
	mapping(address => uint) client_tokens; // client_tokens[client_address] = num_tokens

	address [] clients;
	uint current_token_count = 0;
	uint MAX_TOKENS = 1000;
	uint token_price = 100000000000000000; // Token price in wei = 0.1 ether

	// Deployed in the migration script with inputs
	function TokenTest(uint unit_price){
		token_price = unit_price;
	}

	// Buy N tokens
    function buy_tokens(uint N) public payable {
		require(current_token_count + N <= MAX_TOKENS);
		if(client_tokens[msg.sender] <= 0){
			clients.push(msg.sender);
		}
		client_tokens[msg.sender] += N;
		current_token_count += N;
    }

    // Return number of tokens bought by specified client
    function get_client_tokens(address client) public returns (uint){
    	return client_tokens[client];
    }

    // Return number of tokens bought by current client
    function get_current_client_tokens() public returns (uint){
    	return client_tokens[msg.sender];
    }

    // Return client list
    function get_client_list() public returns (address []){
    	return clients;
    }

    // Return per-token price
    function get_token_price() public returns (uint){
    	return token_price;
    }

	// Get total tokens sold
    function get_current_token_count() public returns (uint){
    	return current_token_count;
    }
}

