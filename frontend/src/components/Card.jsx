import { useEffect, useState } from "preact/hooks";
import { buyNFT, listNFTForSale, placeBid } from "../api";
import { useStore } from "@nanostores/preact";
import { userAddress } from "../utils/userAddress";

export default function Card({ nft }) {
  const {
    tokenURI,
    tokenId: { hex: tokenId },
  } = nft;

  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellPrice, setSellPrice] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const $userAddress = useStore(userAddress);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        // Fetch NFT metadata
        const metadataResponse = await fetch(tokenURI);
        if (!metadataResponse.ok) {
          throw new Error("Error fetching metadata");
        }
        const metadata = await metadataResponse.json();

        // Fetch sale status and price
        const priceResponse = await fetch(
          `http://localhost:8008/api/marketplace/price/${tokenId}`
        );
        const priceData = await priceResponse.json();
        if (!priceData.success) {
          throw new Error(priceData.error);
        }

        // Fetch ownership status
        const ownershipResponse = await fetch(
          `http://localhost:8008/api/nft/is-owner?tokenId=${tokenId}&account=${$userAddress}`
        );
        const ownershipData = await ownershipResponse.json();

        // Fetch auction status
        const auctionResponse = await fetch(
          `http://localhost:8008/api/auction/status/${tokenId}`
        );
        const auctionData = await auctionResponse.json();

        setMetadata({
          ...metadata,
          forSale: parseInt(priceData.price, 10) > 0,
          price: priceData.price,
          owner: ownershipData.isOwner,
          onAuction: auctionData.success && auctionData.onAuction,
          currentBid: auctionData.success ? auctionData.currentBid : null,
        });
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, [tokenURI, tokenId, $userAddress]);

  const handleBuyNFT = async () => {
    try {
      const response = await fetch(
        `http://localhost:8008/api/marketplace/price/${tokenId}`
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      const txHash = await buyNFT(tokenId, data.price);
      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  };

  const handleListNFT = async () => {
    try {
      const txHash = await listNFTForSale(tokenId, sellPrice);
      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Error listing NFT:", error);
    }
  };

  const handlePlaceBid = async () => {
    try {
      const txHash = await placeBid(tokenId, bidAmount);
      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!metadata) {
    return <div>Error loading metadata</div>;
  }

  return (
    <div className="card card-side bg-base-100 shadow-xl">
      <figure>
        <img src={metadata.image} alt="NFT" height="20px" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {metadata.name}
          {metadata.onAuction && (
            <div className="badge badge-warning ml-2">In Auction</div>
          )}
        </h2>
        <p>{metadata.description}</p>
        <div className="card-actions justify-end">
          {metadata.forSale && !metadata.onAuction && (
            <button onClick={handleBuyNFT} className="btn btn-primary">
              Buy
            </button>
          )}
          {metadata.owner && (
            <div>
              <input
                type="text"
                placeholder="Precio en ETH"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                className="input input-bordered"
              />
              <button onClick={handleListNFT} className="btn btn-primary">
                Sell
              </button>
            </div>
          )}
          {metadata.onAuction && (
            <div>
              <p>Current Bid: {metadata.currentBid} ETH</p>
              <input
                type="text"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="input input-bordered"
              />
              <button onClick={handlePlaceBid} className="btn btn-primary">
                Place Bid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
