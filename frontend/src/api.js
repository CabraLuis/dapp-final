const API_BASE_URL = "http://localhost:8008/api";

// Función para acuñar un NFT
export async function mintNFT(toAddress, metadata) {
  try {
    const response = await fetch(`${API_BASE_URL}/nft/mint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toAddress, metadata }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error acuñando NFT");
    return data.txHash;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Función para obtener todos los NFTs acuñados
export async function getAllMintedNFTs() {
  try {
    const response = await fetch(`${API_BASE_URL}/nft/all`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error obteniendo NFTs");
    return data.nfts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Función para listar un NFT en el marketplace
export async function listNFTForSale(tokenId, price) {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId, price }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error listando NFT");
    return data.txHash;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Función para comprar un NFT
export async function buyNFT(tokenId, price) {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId, price }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error comprando NFT");
    return data.txHash;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Función para crear una subasta
export async function createAuction(tokenId, startingBid, duration) {
  try {
    const response = await fetch(`${API_BASE_URL}/auction/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId, startingBid, duration }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error creando subasta");
    return data.txHash;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
