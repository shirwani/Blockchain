var TokenTest = artifacts.require("./TokenTest.sol");
module.exports = function(deployer) {
	deployer.deploy(TokenTest,web3.toWei('0.1', 'ether'));
};
