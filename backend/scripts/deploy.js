const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // 1. Desplegar NFT
  console.log("Deploying NFT...");
  const NFT = await ethers.getContractFactory("NFT");
  const nftContract = await NFT.deploy();
  await nftContract.deployed();
  console.log("NFT deployed at:", nftContract.address);

  // 2. Desplegar Marketplace
  console.log("Deploying Marketplace...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplaceContract = await Marketplace.deploy(nftContract.address);
  await marketplaceContract.deployed();
  console.log("Marketplace deployed at:", marketplaceContract.address);

  // 3. Desplegar Auction
  console.log("Deploying Auction...");
  const Auction = await ethers.getContractFactory("Auction");
  const auctionContract = await Auction.deploy(nftContract.address); // Vincular NFTContract
  await auctionContract.deployed();
  console.log("Auction deployed at:", auctionContract.address);

  // 4. Desplegar Wallet
  console.log("Deploying Wallet...");
  const owners = [
    "0xd3039c7baC51D622279F7DD4c4d35715aD8096f9", // Carla
    "0xb1470A2f7d60ec5DE45fCD2a4A6E9D7a2b0b941e", // Jafet
    "0x7410Ad86D6134A5D477e54b59F0123e163398c9D", // Cabra
  ];
  const requiredApprovals = 2;
  const Wallet = await ethers.getContractFactory("Wallet");
  const walletContract = await Wallet.deploy(owners, requiredApprovals);
  await walletContract.deployed();
  console.log("Wallet deployed at:", walletContract.address);

  // Guardar direcciones en un archivo
  const deploymentData = {
    NFT_CONTRACT: nftContract.address,
    MARKETPLACE_CONTRACT: marketplaceContract.address,
    AUCTION_CONTRACT: auctionContract.address,
    WALLET_CONTRACT: walletContract.address,
  };

  fs.writeFileSync(
    "./deployedContracts.json",
    JSON.stringify(deploymentData, null, 2)
  );
  console.log("Contract addresses saved to deployedContracts.json");
}

// Ejecutar el script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
