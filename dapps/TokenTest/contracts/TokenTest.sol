pragma solidity ^0.4.8;

contract TokenTest{
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
