const express = require("express");
const {
  depositEther,
  submitTransaction,
  approveTransaction,
  executeTransaction,
} = require("../controllers/wallet");

const router = express.Router();

// Ruta para depositar Ether
router.post("/deposit", async (req, res) => {
  const { amount } = req.body;
  try {
    const txHash = await depositEther(amount);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para crear una transacción
router.post("/submit", async (req, res) => {
  const { to, amount } = req.body;
  try {
    const txHash = await submitTransaction(to, amount);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para aprobar una transacción
router.post("/approve", async (req, res) => {
  const { transactionId } = req.body;
  try {
    const txHash = await approveTransaction(transactionId);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para ejecutar una transacción
router.post("/execute", async (req, res) => {
  const { transactionId } = req.body;
  try {
    const txHash = await executeTransaction(transactionId);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
