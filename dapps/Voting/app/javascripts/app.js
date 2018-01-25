import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import contracts_artifacts from '../../build/contracts/Voting.json'

var Contract = contract(contracts_artifacts);
window.web3 = new Web3(web3.currentProvider);
Contract.setProvider(web3.currentProvider);

var candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

window.addEventListener('load', function() { App.start(); });
window.App = {
	start: function() {
		var self = this;
		listVotes();

		$("#vote").submit(
			function(event) {
				voteForCandidate()
				event.preventDefault();
			}
		);
	}
}

function listVotes(){
	Contract.deployed().then(
		function(contract) {
			var candidateNames = Object.keys(candidates);
			for (let i = 0; i < candidateNames.length; i++) {
				let name = candidateNames[i];
				contract.totalVotesFor.call(name).then(
					function(v){
						$("#" + candidates[name]).html(v.toString());
					}
				);
			}
		}
	);
}

function voteForCandidate(){
	var candidate = candidates[$("#candidate").val()];
	Contract.deployed().then(
		function(contract){
			contract.voteForCandidate(candidate, {from: web3.eth.accounts[1], gas: 440000}).then(
				function(){
					contract.totalVotesFor.call(candidate).then(
						function(v){
							$("#" + candidate).html(v.toString());
						}
					)
				}
			)
		}
	);
}
