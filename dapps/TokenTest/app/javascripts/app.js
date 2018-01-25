import "../stylesheets/app.css";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import contracts_artifacts from '../../build/contracts/TokenTest.json'

var Contract = contract(contracts_artifacts);
window.web3 = new Web3(web3.currentProvider);
Contract.setProvider(web3.currentProvider);

window.addEventListener('load', function() { App.start(); });
window.App = {
	start: function() {
		var self = this;
		disp_button()
		disp_tokens()

		$("#buy_token").submit(function(event){
			let num_tokens_to_buy = parseInt($("#num_tokens_to_buy").val());
			do_buy_token(num_tokens_to_buy);
			event.preventDefault();
		})
	}
}

function get_client_list(){
	let str = '<table border=0 cellpadding=1 cellspacing=1 bgcolor="#bbbbbb">';
	str += '<th>Client</th>'
	str += '<th># tokens</th>'
	Contract.deployed().then(function(c){
		c.get_client_list.call().then(function(clients){
			for(let i=0; i<clients.length; i++){
				c.get_client_tokens.call(clients[i]).then(function(num_tokens){
					str += '<tr bgcolor="white"><td>' + clients[i].toString() + '</td><td>' + num_tokens.toString() + '</td></tr>';
					$("#clients").html(str);
				})
			}
		})
	})
}

function disp_tokens(){
	let str = ''
	Contract.deployed().then(function(c){
		c.get_current_token_count.call().then(function(N){
			str += ('Total tokens sold: ' + N.toString() + "<br/>");
			web3.eth.getBalance(c.address, function(error, result) {
				str += ("Account balance: " + web3.fromWei(result.toString()) + " (ether) <br/>");
				$("#contract_balance").html(str);
			})
		})
		get_client_list();
	})
}

function disp_button(){
	let str = `
        <form id="buy_token">
			<input type="text" id="num_tokens_to_buy">
		</form>
	`
	$("#token_panel").html(str);
}

function do_buy_token(num_tokens_to_buy){
	Contract.deployed().then(function(c){
		c.get_token_price.call().then(function(token_price){
			let price_to_pay = num_tokens_to_buy * token_price; // Price in wei
			console.log('Buying ' + num_tokens_to_buy + ' tokens for ' + web3.fromWei(price_to_pay).toString() + ' (ether)');
			c.buy_tokens(num_tokens_to_buy, {value:price_to_pay, from:web3.eth.accounts[0], gas:1400000}).then(function(){
				disp_tokens();
			})
		})
	})
}
