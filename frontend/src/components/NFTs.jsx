import { useState, useEffect } from "preact/hooks";
import {
  mintNFT,
  getAllMintedNFTs,
  listNFTForSale,
  buyNFT,
  createAuction,
} from "../api";

export default function App() {
  const [userAddress, setUserAddress] = useState("");
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [nfts, setNfts] = useState([]);
  const [message, setMessage] = useState("");

  // Conectar MetaMask y obtener la dirección de la cuenta
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]); // Configura la cuenta conectada
        setMessage(`MetaMask conectado: ${accounts[0]}`);
      } catch (error) {
        console.error("Error conectando MetaMask:", error);
        setMessage(
          "Error conectando MetaMask. Asegúrate de haber iniciado sesión."
        );
      }
    } else {
      alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
    }
  };

  useEffect(() => {
    // Intenta conectar MetaMask automáticamente al cargar la página
    connectMetaMask();
  }, []);

  const handleMint = async () => {
    try {
      if (!userAddress)
        throw new Error("Conecta MetaMask para obtener tu dirección.");
      setMessage("Minting NFT...");
      const txHash = await mintNFT(userAddress, metadata);
      setMessage(`NFT minted successfully! Transaction Hash: ${txHash}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const fetchNFTs = async () => {
    try {
      setMessage("Fetching NFTs...");
      const fetchedNFTs = await getAllMintedNFTs();
      setNfts(fetchedNFTs);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleListNFT = async () => {
    try {
      setMessage("Listing NFT...");
      const txHash = await listNFTForSale(tokenId, price);
      setMessage(`NFT listed successfully! Transaction Hash: ${txHash}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleBuyNFT = async () => {
    try {
      setMessage("Buying NFT...");
      const txHash = await buyNFT(tokenId, price);
      setMessage(`NFT bought successfully! Transaction Hash: ${txHash}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>NFT Marketplace</h1>
      <p>{message}</p>
      <p>
        <strong>Conectado como:</strong> {userAddress || "No conectado"}
      </p>
      {!userAddress && (
        <button onClick={connectMetaMask}>Conectar MetaMask</button>
      )}

      <section>
        <h2>Mint NFT</h2>
        <input
          type="text"
          placeholder="Name"
          value={metadata.name}
          onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={metadata.description}
          onChange={(e) =>
            setMetadata({ ...metadata, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          value={metadata.image}
          onChange={(e) => setMetadata({ ...metadata, image: e.target.value })}
        />
        <button onClick={handleMint}>Mint</button>
      </section>

      <section>
        <h2>Fetch Minted NFTs</h2>
        <button onClick={fetchNFTs}>Fetch NFTs</button>
        <ul>
          {nfts.map((nft, index) => (
            <li key={index}>{JSON.stringify(nft)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>List NFT for Sale</h2>
        <input
          type="text"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={handleListNFT}>List NFT</button>
      </section>

      <section>
        <h2>Buy NFT</h2>
        <input
          type="text"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={handleBuyNFT}>Buy NFT</button>
      </section>
    </div>
  );
}
