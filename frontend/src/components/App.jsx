import { useState, useEffect } from "preact/hooks";
import { getAllMintedNFTs, listNFTForSale } from "../api";
import Card from "./Card";

export default function App() {
  const [nfts, setNfts] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all minted NFTs
  const fetchNFTs = async () => {
    try {
      setMessage("Fetching NFTs...");
      const [tokenIds, tokenURIs] = await getAllMintedNFTs();
      const nftData = tokenIds.map((id, index) => ({
        tokenId: id,
        tokenURI: tokenURIs[index],
      }));
      setNfts(nftData);
      setMessage(""); // Clear message after success
    } catch (error) {
      setMessage(`Error fetching NFTs: ${error.message}`);
    }
  };

  // Fetch NFTs on component mount
  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div>
      <div className="message">{message && <p>{message}</p>}</div>
      <div className="grid grid-cols-5 gap-4">
        {nfts.map((nft) => (
          <Card key={nft.tokenId} nft={nft} />
        ))}
      </div>
    </div>
  );
}
