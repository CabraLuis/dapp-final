import { useState } from "preact/hooks";

export default function Auction() {
  const [tokenId, setTokenId] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateAuction = async (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del formulario
    try {
      setMessage("Creating auction...");
      const response = await fetch("http://localhost:8008/api/auction/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId,
          startingBid,
          duration,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      setMessage("Auction created successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Crea una Subasta</h1>
          <p className="py-6">
            ¡Establece tu obra en subasta y deja que los interesados pujen por
            ella!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleCreateAuction}>
            {message && (
              <div
                className={`alert ${
                  message.startsWith("Error") ? "alert-error" : "alert-success"
                } mb-4`}
              >
                {message}
              </div>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text">ID del Token</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Ingresa el ID del Token"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Oferta Inicial (en ETH)</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Ingresa la oferta inicial"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Duración (en segundos)</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Duración de la subasta"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Crear Subasta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
