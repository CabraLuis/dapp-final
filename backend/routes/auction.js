const express = require("express");
const {
  createAuction,
  placeBid,
  finalizeAuction,
  getAuctionDetails,
} = require("../controllers/auction");

const router = express.Router();

// Crear Subasta
router.post("/create", async (req, res) => {
  const { tokenId, startingBid, duration } = req.body;

  if (!tokenId || !startingBid || !duration) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    const txHash = await createAuction(tokenId, startingBid, duration);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pujar en Subasta
router.post("/bid", async (req, res) => {
  const { tokenId, bidAmount } = req.body;

  if (!tokenId || !bidAmount) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    const txHash = await placeBid(tokenId, bidAmount);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Finalizar Subasta
router.post("/finalize", async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    return res.status(400).json({ success: false, error: "Missing tokenId" });
  }

  try {
    const txHash = await finalizeAuction(tokenId);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener Detalles de Subasta
router.get("/status/:tokenId", async (req, res) => {
  const { tokenId } = req.params;

  if (!tokenId) {
    return res.status(400).json({ success: false, error: "Missing tokenId" });
  }

  try {
    const details = await getAuctionDetails(tokenId);
    res.json({ success: true, details });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
