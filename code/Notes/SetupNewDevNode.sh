#################
# INSTALLING GETH
#################
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum

#############
# INSTALL NPM
#############
sudo apt install npm

##############
# INSTALL NODE
##############
sudo apt-get install python-software-properties
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install nodejs
sudo npm install web3@^0.20.0

##############
# TRUFFLE DAPP
##############
#sudo npm install -g truffle@3.2.1
#sudo npm install -g webpack

##############
# INSTALL SOLC
##############
sudo npm install solc

#################
# INSTALL TESTRPC
#################
sudo npm install -g ethereumjs-testrpc

