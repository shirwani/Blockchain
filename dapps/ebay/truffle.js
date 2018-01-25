require('babel-register')
module.exports = {
    solc: '/usr/local/bin/solc',
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*' // Match any network id
        }
    }
}
