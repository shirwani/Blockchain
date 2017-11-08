web3 = new Web3(new Web3.providers.HttpProvider("http://13.58.251.221:8545"));
abi = JSON.parse('[{"constant":false,"inputs":[{"name":"idx","type":"uint256"}],"name":"getCar","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"vin","type":"string"}],"name":"addCar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getNumCars","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"vin","type":"string"}],"name":"getNumEvents","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"cars","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vin","type":"string"}],"name":"addEvent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')
CarfaxContract = web3.eth.contract(abi);
contractInstance = CarfaxContract.at('0xdf6628178328344692d802a37d20306d760765a3');

$(document).ready(function(){
	dispCarsTable()
});

function dispCarsTable(){
	let numCars = parseInt(contractInstance.getNumCars.call().toString())
	let str = ''
	str += addCarButton()
	str += '<table border=0 cellpadding=5 cellspacing=1 bgcolor=#dddddd>'
	for(i=0; i<numCars; i++){
		let vin = contractInstance.getCar.call(i);
		let idx = i + 1;
		str += '<tr bgcolor=#ffffff>'
		str += '<td>' + idx + '</td>'
		str += '<td>' + vin + '</td>'
		str += '<td>' + getNumEvents(vin) + '</td>'
		str += '<td>' + addEventButton(vin) + '</td>'
		str += '</tr>'
	}
	str += '</table>'
	$("#carinfo").html(str)
}

function getNumEvents(vin){
	return contractInstance.getNumEvents.call(vin).toString()
}

function addEvent(vin){
	contractInstance.addEvent(vin, {gas: 140000, from: web3.eth.accounts[0]});
	dispCarsTable();
}

function addEventButton(vin){
	return '<input type=button value="+" onClick=\'addEvent("' + vin + '")\' />';
}

function addCarButton(){
	return '<input type=button value="Add New Car" onClick=\'addCar()\' />';
}

function addCar(){
	contractInstance.addCar(generateVinNumber(), {from: web3.eth.accounts[0], gas: 4700000})
	dispCarsTable()
}

function generateVinNumber() {
	let text = '';
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (let i=0; i<10; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}


//vin = 'HJ87798374794SDA'
//contractInstance.addCar(vin,{data: byteCode, from: web3.eth.accounts[0], gas: 4700000} )
//contractInstance.addEvent(vin,{data: byteCode, from: web3.eth.accounts[0], gas: 4700000})
//contractInstance.getNumEvents.call(vin).toString()
//contractInstance.getNumCars.call().toString()
//contractInstance.getCar.call(0).toString()

