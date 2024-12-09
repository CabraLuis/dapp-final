require("dotenv").config();
const { ethers } = require("ethers");
const auctionAbi = require("../artifacts/contracts/Auction.sol/Auction.json").abi;

const { PRIVATE_KEY, API_URL, AUCTION_CONTRACT } = process.env;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const auctionContract = new ethers.Contract(AUCTION_CONTRACT, auctionAbi, wallet);

// Crear Subasta
async function createAuction(tokenId, startingBid, durationInMinutes) {
  try {
    const duration = durationInMinutes * 60; // Convertir a segundos
    const tx = await auctionContract.createAuction(tokenId, ethers.utils.parseEther(startingBid), duration);
    await tx.wait();
    console.log("Subasta creada:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error creando subasta:", error);
    throw error;
  }
}

// Pujar en Subasta
async function placeBid(tokenId, bidAmount) {
  try {
    const tx = await auctionContract.placeBid(tokenId, { value: ethers.utils.parseEther(bidAmount) });
    await tx.wait();
    console.log("Puja realizada:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error realizando puja:", error);
    throw error;
  }
}

// Finalizar Subasta
async function finalizeAuction(tokenId) {
  try {
    const tx = await auctionContract.finalizeAuction(tokenId);
    await tx.wait();
    console.log("Subasta finalizada:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error finalizando subasta:", error);
    throw error;
  }
}

module.exports = {
  createAuction,
  placeBid,
  finalizeAuction,
};
