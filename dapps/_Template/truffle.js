require('babel-register')
module.exports = {
    solc: '/usr/local/bin/solc',
    networks: {
        development: {
            //gas: 4000000,
            //from: '0xe9d90b7a2c5d49d0f85a2a73246274f1a8a625a6', // unlocked account
            host: 'localhost',
            port: 8545,
            network_id: '*' // Match any network id
        }
    }
}
