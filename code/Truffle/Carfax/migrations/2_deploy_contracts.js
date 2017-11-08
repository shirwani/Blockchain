var Carfax = artifacts.require("./Carfax.sol");
module.exports = function(deployer){
    deployer.deploy(Carfax, 'XBHHYS765KJ');
};