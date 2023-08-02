require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",

  
  networks: { 
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/lAHM3rrDoqQU5NZBg6E2jrRlnUoR_blQ`,
      accounts: ["0x1bbfb5e85f0ed63d5114cd9e34851f2a8c8bb9aa78b4cbdd1f7e831f751c3548"]
    }
  }
};
