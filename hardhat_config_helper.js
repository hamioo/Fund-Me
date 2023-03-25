// this js fie is basicly for mock things . mock :MockV3Aggregator.sol
const networkconfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694aa1769357215de4fac081bf1f309adc325306",
    },
    // 11155111: { // shold add the network in"hardhat.config.js" but alchemy is filtered by akhonde koskesk
    //     name: "goerli",
    //     ethUsdPriceFeed: "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e",
    // },
}

//
const deploymentChains = [31337]
const decimals = 8
const initialAnswer = 150000000000 // it 8 zeros more that ETHprice to make that 8 decimals sence

module.exports = {
    networkconfig,
    deploymentChains,
    decimals,
    initialAnswer,
}
