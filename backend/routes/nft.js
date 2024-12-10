const express = require("express");
const { mintNFT, getAllMintedNFTs, isOwner } = require("../controllers/nft");

const router = express.Router();

// Ruta para acuñar un NFT
router.post("/mint", async (req, res) => {
  const { toAddress, metadata } = req.body;
  try {
    const txHash = await mintNFT(toAddress, metadata);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para obtener todos los NFTs acuñados
router.get("/all", async (req, res) => {
  try {
    const nfts = await getAllMintedNFTs();
    res.json({ success: true, nfts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/is-owner", isOwner);

module.exports = router;
