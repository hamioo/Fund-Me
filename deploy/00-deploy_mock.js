// mock is some thing that help us make a price feed address for our localhost network
// its basicly like the standard deploy contract for the harrdhat deploy package that we alrerady made one so:

const console = require("console")
const { network } = require("hardhat")
const {
    deploymentChains,
    decimals,
    initialAnswer,
} = require("../hardhat_config_helper")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (deploymentChains.includes(chainId)) {
        console.log("network detected, deploying mock...")
        await deploy("MockV3Aggregator", {
            // contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [
                // put the things the every contract constructor needs
                decimals,
                initialAnswer,
            ],
        })
        console.log("mock deployed")
        console.log("________________________________________________")
    }
}

module.exports.tags = ["all", "mock"] //you can use tag when calling deploy in terminal by writing --tags ...
