const express = require("express");
const {
  listNFTForSale,
  buyNFT,
  getSalePrice,
} = require("../controllers/marketplace");

const router = express.Router();

// Ruta para listar un NFT en el Marketplace
router.post("/list", async (req, res) => {
  const { tokenId, price } = req.body;
  try {
    const txHash = await listNFTForSale(tokenId, price);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para comprar un NFT del Marketplace
router.post("/buy", async (req, res) => {
  const { tokenId, price } = req.body;
  try {
    const txHash = await buyNFT(tokenId, price);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/price/:tokenId", async (req, res) => {
  const { tokenId } = req.params;
  try {
    const price = await getSalePrice(tokenId);
    res.json({ success: true, price: price.toString() }); // Devolver el precio como string para evitar problemas con números grandes
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
