require("dotenv").config();
const { ethers } = require("ethers");
const auctionAbi =
  require("../artifacts/contracts/Auction.sol/Auction.json").abi;

const { PRIVATE_KEY, API_URL, AUCTION_CONTRACT } = process.env;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const auctionContract = new ethers.Contract(
  AUCTION_CONTRACT,
  auctionAbi,
  wallet
);

// Crear Subasta
async function createAuction(tokenId, startingBid, durationInMinutes) {
  try {
    const duration = durationInMinutes * 60; // Convertir a segundos
    const tx = await auctionContract.createAuction(
      tokenId,
      ethers.utils.parseEther(startingBid),
      duration
    );
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
    const tx = await auctionContract.placeBid(tokenId, {
      value: ethers.utils.parseEther(bidAmount),
    });
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

// Obtener Detalles de la Subasta
async function getAuctionDetails(tokenId) {
  try {
    const auction = await auctionContract.getAuctionDetails(tokenId);
    const details = {
      tokenId: auction.tokenId.toString(),
      seller: auction.seller,
      highestBid: ethers.utils.formatEther(auction.highestBid), // Convertir Wei a ETH
      highestBidder: auction.highestBidder,
      endTime: auction.endTime.toNumber(), // Timestamp en segundos
      finalized: auction.finalized,
    };
    console.log("Detalles de la subasta:", details);
    return details;
  } catch (error) {
    console.error("Error obteniendo detalles de la subasta:", error);
    throw error;
  }
}

module.exports = {
  createAuction,
  placeBid,
  finalizeAuction,
  getAuctionDetails,
};
