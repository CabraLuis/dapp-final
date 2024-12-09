require("dotenv").config();
const { ethers } = require("ethers");
const walletAbi = require("../artifacts/contracts/Wallet.sol/Wallet.json").abi;

const { PRIVATE_KEY, API_URL, WALLET_CONTRACT } = process.env;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const walletContract = new ethers.Contract(WALLET_CONTRACT, walletAbi, wallet);

// Enviar Ether al contrato
async function depositEther(amount) {
    try {
        const tx = await walletContract.deposit({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        console.log("Depósito realizado con éxito:", tx.hash);
        return tx.hash;
    } catch (error) {
        console.error("Error realizando depósito:", error);
        throw error;
    }
}

// Crear una transacción
async function submitTransaction(to, amount) {
    try {
        const tx = await walletContract.submitTransaction(to, ethers.utils.parseEther(amount));
        await tx.wait();
        console.log("Transacción creada con éxito:", tx.hash);
        return tx.hash;
    } catch (error) {
        console.error("Error creando transacción:", error);
        throw error;
    }
}

// Aprobar una transacción
async function approveTransaction(transactionId) {
    try {
        const tx = await walletContract.approveTransaction(transactionId);
        await tx.wait();
        console.log("Transacción aprobada con éxito:", tx.hash);
        return tx.hash;
    } catch (error) {
        console.error("Error aprobando transacción:", error);
        throw error;
    }
}

// Ejecutar una transacción
async function executeTransaction(transactionId) {
    try {
        const tx = await walletContract.executeTransaction(transactionId);
        await tx.wait();
        console.log("Transacción ejecutada con éxito:", tx.hash);
        return tx.hash;
    } catch (error) {
        console.error("Error ejecutando transacción:", error);
        throw error;
    }
}

module.exports = {
    depositEther,
    submitTransaction,
    approveTransaction,
    executeTransaction,
};
