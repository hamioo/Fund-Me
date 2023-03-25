const { networkconfig, deploymentChains } = require("../hardhat_config_helper")

const { network } = require("hardhat")
const { verify } = require("../utils/Verify")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedaddress
    if (deploymentChains.includes(chainId)) {
        const priceAddress = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedaddress = priceAddress.address
    } else {
        ethUsdPriceFeedaddress = networkconfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedaddress]
    // deploying contract
    console.log("started deploying FundMe")
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // the price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log("_________________________!_______________________")

    if (!deploymentChains.includes(chainId) && process.env.etherscan_API_Key) {
        await verify(FundMe.address, args)
        console.log("______________________verified__________________________")
    }
}

module.exports.tags = ["all", "fundme"]
