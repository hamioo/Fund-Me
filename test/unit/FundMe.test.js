// https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/5113
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { deploymentChains } = require("../../hardhat_config_helper")

!deploymentChains.includes(network.config.chainId)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendAmount = ethers.utils.parseEther("1") // equal to 1eth
          beforeEach(async function () {
              // deploying our FundMe contract
              // using hardhat-deploy
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("Constructor", async () => {
              it("sets the pricefeed address correctly", async function () {
                  const response = await fundMe.priceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("Fund", async () => {
              it("Fails of low Amount of ETH", async () => {
                  await expect(fundMe.Fund()).to.be.revertedWith("Irani")
              })

              it("update the amount funded data structur", async () => {
                  await fundMe.Fund({ value: sendAmount })
                  const response = await fundMe.FunderToAmount(deployer)
                  assert.equal(response.toString(), sendAmount.toString())
              })

              it("it should update Funders array correctly", async () => {
                  await fundMe.Fund({ value: sendAmount })
                  const Funders = await fundMe.Funders(0)
                  assert.equal(Funders, deployer)
              })
          })

          describe("Withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.Fund({ value: sendAmount })
              })

              it("Withdraw correctly", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // act
                  const transactionResponse = await fundMe.Withdraw()
                  const transactionRecipt = await transactionResponse.wait(1)

                  const { effectiveGasPrice, gasUsed } = transactionRecipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)
                  // reArrange
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      // did breakpoint debuging to find out gascost from transactionRecipt
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("withdraw with multiple accounts", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i <= 5; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )

                      await fundMeConnectedContract.Fund({ value: sendAmount })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.Withdraw()
                  const transactionRecipt = await transactionResponse.wait(1)

                  const { effectiveGasPrice, gasUsed } = transactionRecipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  // reArrange
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      // did breakpoint debuging to find out gascost from transactionRecipt
                      endingDeployerBalance.add(gasCost).toString()
                  )
                  // wanna see if the Funders array will reset
                  await expect(fundMe.Funders(0)).to.be.reverted

                  for (let i = 1; i <= 5; i++) {
                      assert.equal(
                          await fundMe.FunderToAmount(accounts[i].address),
                          0
                      )
                  }
              })

              it("onlyOwner checker", async () => {
                  const accounts = await ethers.getSigners()
                  const enemy = accounts[1]
                  const enemyConnectedContract = fundMe.connect(enemy)
                  await expect(enemyConnectedContract.Withdraw()).to.be.reverted
              })
          })
      })
