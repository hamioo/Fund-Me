const { version } = require("chai")

require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.18",
}
require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
// using ethersca APi key for verifing
require("@nomiclabs/hardhat-etherscan")
//
// require("hardhat-gas-reporter")
// coverage
require("solidity-coverage")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
const RPCURL_sepolia = process.env.RPC_URL_sepolia || "blablabla"
const PrivateKey = process.env.Private_key
const etherscan_API_Key = process.env.etherscan_API_Key

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        sepolia: {
            url: RPCURL_sepolia,
            accounts: [PrivateKey],
            chainId: 11155111,
            // blockConfirmations: 6,
        },

        // a network made using hardhat network bu yarn hardhat node
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    solidity: {
        compilers: [{ version: "0.6.6" }, { version: "0.8.8" }],
    },
    etherscan: {
        apiKey: etherscan_API_Key,
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas_reporter.txt",
        noColor: true,
        // currency : "USD"
        // cooinmarketcap : coinMarketCap_API_key
        // token : "MATIC"
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        // user : {
        //   default : the number of index of account in accounts Array in network
        // }
    },
}
