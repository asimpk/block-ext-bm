// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = hre;

async function main() {

  const TabBookmarks = await ethers.getContractFactory("TabBookmarks")
  const CustomBookmarks = await ethers.getContractFactory("CustomBookmarks")

  const tabBookmarks = await TabBookmarks.deploy();
  const customBookmarks = await CustomBookmarks.deploy();

  await tabBookmarks.waitForDeployment();
  await customBookmarks.waitForDeployment();


  console.log(
    `Lock with deployed to ${await tabBookmarks.getAddress()} ${await customBookmarks.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
