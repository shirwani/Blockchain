pragma solidity ^0.4.2;

contract Voting {
    mapping (bytes32 => uint8) public votesReceived;
    bytes32[] public candidateList;

    //totalVotesFor.call('Rama')
    function totalVotesFor(bytes32 candidate) returns (uint8) {
        return votesReceived[candidate];
    }

    // voteForCandidate('Rama', {from: web3.eth.accounts[0]})
    function voteForCandidate(bytes32 candidate) {
        votesReceived[candidate] += 1;
    }

    function validCandidate(bytes32 candidate) returns (bool) {
        for(uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
}


