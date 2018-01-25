#!/usr/bin/env bash

#############
# INSTALL NPM
#############
sudo apt install -y npm

#################
# INSTALLING GETH
#################
sudo apt-get update
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum
sudo npm install ethereumjs-util
#apt-get install -y install ethereumjs-util

##############
# INSTALL NODE
##############
sudo apt-get install -y python-software-properties
apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
#sudo npm install web3@^0.20.0
#sudo apt-get install -y git
sudo npm install -y web3

#################
# INSTALL TRUFFLE
#################
sudo npm install -g -y  truffle@3.2.2
#sudo npm install -g truffle
sudo npm install -g -y webpack

##############
# INSTALL SOLC
##############
sudo npm install -y solc

#################
# INSTALL TESTRPC
#################
sudo npm install -g -y ethereumjs-testrpc

##############
# SETUP APACHE
##############
sudo apt-get update
sudo apt-get -y install apache2
sudo apache2ctl configtest
sudo sh -c 'echo "ServerName '$(curl ipinfo.io/ip)'" >> /etc/apache2/apache2.conf'
sudo apache2ctl configtest
sudo systemctl restart apache2
sleep 3
sudo ufw app list
sleep 3
sudo ufw app info "Apache Full"
sleep 3
sudo ufw allow in "Apache Full"
sleep 3

#################
# INSTALL MONGODB
#################
#sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
#echo "deb [ arch=amd64 ] 		http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/testing multiverse"  | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
#echo "deb [ arch=amd64 ] 		http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/testing multiverse"	| sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
#echo "deb [ arch=amd64,arm64 ] 	http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/testing multiverse" 	| sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
#sudo apt-get update
#sudo apt-get install -y mongodb-org
###############
# START MONGODB
###############
#sudo service mongod start # stop | restart
#grep "\[initandlisten\] waiting for connections on port" /var/log/mongodb/mongod.log



