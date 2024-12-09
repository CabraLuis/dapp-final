const express = require("express");
const { createAuction, placeBid, finalizeAuction } = require("../controllers/auction");

const router = express.Router();

// Ruta para crear una subasta
router.post("/create", async (req, res) => {
  const { tokenId, startingBid, duration } = req.body;
  try {
    const txHash = await createAuction(tokenId, startingBid, duration);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para colocar una oferta en una subasta
router.post("/bid", async (req, res) => {
  const { tokenId, bidAmount } = req.body;
  try {
    const txHash = await placeBid(tokenId, bidAmount);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para finalizar una subasta
router.post("/finalize", async (req, res) => {
  const { tokenId } = req.body;
  try {
    const txHash = await finalizeAuction(tokenId);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
