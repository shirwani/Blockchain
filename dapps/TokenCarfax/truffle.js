require('babel-register')
module.exports = {
    solc: '/usr/local/bin/solc',
    networks: {
        development: {
            gas: 4000000,
            from: '0x0e077d1c5aa68d643f3272c1a2718ff6f3437b39', // unlocked account
            host: 'localhost',
            port: 8545,
            network_id: '*' // Match any network id
        }
    }
}

