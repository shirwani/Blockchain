var contract = artifacts.require("./TokenCarfax.sol");
module.exports = function(deployer) {
	deployer.deploy(contract);
};

