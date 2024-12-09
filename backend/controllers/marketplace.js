require("dotenv").config();
const { ethers } = require("ethers");
const marketplaceAbi = require("../artifacts/contracts/Marketplace.sol/Marketplace.json").abi;

const { PRIVATE_KEY, API_URL, MARKETPLACE_CONTRACT } = process.env;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT, marketplaceAbi, wallet);

// Listar un NFT en el Marketplace
async function listNFTForSale(tokenId, price) {
  try {
    const tx = await marketplaceContract.listNFTForSale(tokenId, ethers.utils.parseEther(price));
    await tx.wait();
    console.log(`NFT listado con éxito (ID: ${tokenId}, Precio: ${price} ETH)`);
    return tx.hash;
  } catch (error) {
    console.error("Error listando NFT:", error);
    throw error;
  }
}

// Comprar un NFT del Marketplace
async function buyNFT(tokenId, price) {
  try {
    const tx = await marketplaceContract.buyNFT(tokenId, { value: ethers.utils.parseEther(price) });
    await tx.wait();
    console.log("NFT comprado con éxito:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error comprando NFT:", error);
    throw error;
  }
}

module.exports = {
  listNFTForSale,
  buyNFT,
};
