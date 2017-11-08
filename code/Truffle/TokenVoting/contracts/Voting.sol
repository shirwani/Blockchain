pragma solidity ^0.4.8;
contract Voting {
	struct voter {
		address voterAddress;
		uint tokensBought;
		uint[] tokensUsedPerCandidate;
	}

	mapping (address => voter) public voterInfo;
	mapping (bytes32 => uint) public votesReceived;

	bytes32[] public candidateList;
	uint public totalTokens;      // Total no. of tokens available for this election
	uint public balanceTokens;    // Total no. of tokens still available for purchase
	uint public tokenPrice;       // Price per token

	// Deployed in the migration script
	function Voting(uint tokens, uint pricePerToken, bytes32[] candidateNames) {
		candidateList   = candidateNames;
		totalTokens     = tokens;
		balanceTokens   = tokens;
		tokenPrice      = pricePerToken;
	}

	function totalVotesFor(bytes32 candidate) constant returns (uint) {
		return votesReceived[candidate];
	}

	function voteForCandidate(bytes32 candidate, uint votesInTokens) {
		uint index = indexOfCandidate(candidate);
		if (index == uint(-1)) throw;
		if (voterInfo[msg.sender].tokensUsedPerCandidate.length == 0) {
			for(uint i = 0; i < candidateList.length; i++) {
				voterInfo[msg.sender].tokensUsedPerCandidate.push(0);
			}
		}
		uint availableTokens = voterInfo[msg.sender].tokensBought - totalTokensUsed(voterInfo[msg.sender].tokensUsedPerCandidate);
		if (availableTokens < votesInTokens) throw;
		votesReceived[candidate] += votesInTokens;
		voterInfo[msg.sender].tokensUsedPerCandidate[index] += votesInTokens;
	}

	function totalTokensUsed(uint[] _tokensUsedPerCandidate) private constant returns (uint) {
		uint totalUsedTokens = 0;
		for(uint i = 0; i < _tokensUsedPerCandidate.length; i++) {
			totalUsedTokens += _tokensUsedPerCandidate[i];
		}
		return totalUsedTokens;
	}

	function indexOfCandidate(bytes32 candidate) constant returns (uint) {
		for(uint i = 0; i < candidateList.length; i++) {
			if (candidateList[i] == candidate) {
				return i;
			}
		}
		return uint(-1);
	}

	function buy() payable returns (uint) {
		uint tokensToBuy = msg.value / tokenPrice;
		if (tokensToBuy > balanceTokens) throw;
		voterInfo[msg.sender].voterAddress = msg.sender;
		voterInfo[msg.sender].tokensBought += tokensToBuy;
		balanceTokens -= tokensToBuy;
		return tokensToBuy;
	}

	function tokensSold() constant returns (uint) {
		return totalTokens - balanceTokens;
	}

	function voterDetails(address user) constant returns (uint, uint[]) {
		return (voterInfo[user].tokensBought, voterInfo[user].tokensUsedPerCandidate);
	}

	/* All the ether sent by voters who purchased the tokens is in this contract's account. This method will be used to
	 * transfer out all those ethers in to another account.
	 * The way this function is written currently, anyone can call this method and transfer the balance in to their account.
	 * In reality, you should add check to make sure only the owner of this contract can cash out.
	 */
	//function transferTo(address account) {
	//      account.transfer(this.balance);
	//}

	function allCandidates() constant returns (bytes32[]) {
		return candidateList;
	}
}