require('babel-register')
module.exports = {
    networks: {
        development: {
            gas: 900000,
            from: '0x835703e87b6ede10de939181fd9783533717f87e', // unlocked account
            host: 'localhost',
            port: 8545,
            network_id: '*' // Match any network id
        }
    }
}