import { useState } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { userAddress } from "../utils/userAddress";
import { mintNFT } from "../api";

export default function MintNFT() {
  const $userAddress = useStore(userAddress);

  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [message, setMessage] = useState("");

  const handleMint = async (e) => {
    e.preventDefault();
    try {
      if (!$userAddress) {
        throw new Error("Conecta MetaMask para obtener tu dirección.");
      }

      // Validación de campos
      if (!metadata.name || !metadata.description || !metadata.image) {
        throw new Error("Por favor, completa todos los campos.");
      }

      setMessage("Minting NFT...");
      const txHash = await mintNFT($userAddress, metadata);
      setMessage(`¡NFT creado exitosamente! Hash de la transacción: ${txHash}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sube tu obra</h1>
          <p className="py-6">
            ¡Comparte con el mundo tus obras y gana dinero haciéndolo!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleMint}>
            {message && <div className="alert alert-info mb-4">{message}</div>}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Ingresa el nombre de tu obra"
                value={metadata.name}
                onChange={(e) =>
                  setMetadata({ ...metadata, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Descripción</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Ingresa una breve descripción"
                value={metadata.description}
                onChange={(e) =>
                  setMetadata({ ...metadata, description: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">URL</span>
              </label>
              <input
                type="url"
                className="input input-bordered"
                placeholder="Ingresa la URL de la imagen"
                value={metadata.image}
                onChange={(e) =>
                  setMetadata({ ...metadata, image: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Subir
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
