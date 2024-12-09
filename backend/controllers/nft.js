require("dotenv").config();
const { ethers } = require("ethers");
const pinataSDK = require("@pinata/sdk");
const nftAbi = require("../artifacts/contracts/NFT.sol/NFT.json").abi;

const {
  PRIVATE_KEY,
  API_URL,
  NFT_CONTRACT,
  PINATA_API_KEY,
  PINATA_SECRET_KEY,
} = process.env;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const nftContract = new ethers.Contract(NFT_CONTRACT, nftAbi, wallet);
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

// Subir metadatos del NFT a IPFS
async function uploadToIPFS(metadata) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`;
  } catch (error) {
    console.error("Error subiendo a IPFS:", error);
    throw error;
  }
}

// Acuñar un nuevo NFT
async function mintNFT(toAddress, metadata) {
  try {
    const tokenURI = await uploadToIPFS(metadata);
    const tx = await nftContract.mintNFT(toAddress, tokenURI);
    await tx.wait();
    console.log("NFT acuñado con éxito:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error acuñando NFT:", error);
    throw error;
  }
}

// Obtener todos los NFTs acuñados
async function getAllMintedNFTs() {
  try {
    const result = await nftContract.getAllMintedNFTs();
    console.log("NFTs acuñados:", result);
    return result;
  } catch (error) {
    console.error("Error obteniendo NFTs:", error);
    throw error;
  }
}

module.exports = {
  mintNFT,
  getAllMintedNFTs,
};
