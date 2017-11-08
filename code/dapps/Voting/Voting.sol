pragma solidity ^0.4.2;

contract Voting {
    mapping (bytes32 => uint8) public votesReceived;
    bytes32[] public candidateList;

    //new(['Rama','Nick','Jose'],{data: '0x' + compiledCode.contracts[':Voting'].bytecode, from: web3.eth.accounts[0], gas: 4700000})
    function Voting(bytes32[] candidateNames) {
        candidateList = candidateNames;
    }

    //totalVotesFor.call('Rama')
    function totalVotesFor(bytes32 candidate) returns (uint8) {
        if (validCandidate(candidate) == false) throw;
        return votesReceived[candidate];
    }

    // voteForCandidate('Rama', {from: web3.eth.accounts[0]})
    function voteForCandidate(bytes32 candidate) {
        if (validCandidate(candidate) == false) throw;
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


