require('babel-register')
module.exports = {
    solc: '/usr/local/bin/solc',
    networks: {
        development: {
            //gas: 4000000,
            //from: '0xc5f027738ddccf6c22072d0b61002d8888cfe013', // unlocked account
            host: 'localhost',
            port: 8545,
            network_id: '*' // Match any network id
        }
    }
}

