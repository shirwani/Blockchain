var contract = artifacts.require("./Carfax.sol");
module.exports = function(deployer) {
	deployer.deploy(contract);
};

