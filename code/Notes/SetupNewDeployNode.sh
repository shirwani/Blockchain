# To run the dapp, drop the build fodler from source/truffle into the web server directory

sudo apt-get update
sudo apt-get install apache2
sudo apache2ctl configtest

sudo echo "ServerName 18.221.44.239" >> /etc/apache2/apache2.conf

sudo apache2ctl configtest
sudo systemctl restart apache2

sudo ufw app list
sudo ufw app info "Apache Full"
sudo ufw allow in "Apache Full"

sudo mkdir -p /var/www/html/Voting
sudo chmod -R a+rw /var/www/html/Voting


