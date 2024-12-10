import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { userAddress } from "../utils/userAddress";

export default function Navbar() {
  const $userAddress = useStore(userAddress);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        userAddress.set(accounts[0]);
        console.log(`MetaMask conectado: ${accounts[0]}`);
      } catch (error) {
        console.error("Error conectando MetaMask:", error);
        alert(
          "Error conectando MetaMask. Asegúrate de haber iniciado sesión correctamente."
        );
      }
    } else {
      alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
    }
  };

  const logOut = () => {
    userAddress.set(null);
    console.log("Sesión cerrada.");
  };

  useEffect(() => {
    if ($userAddress) {
      console.log(`Usuario conectado: ${$userAddress}`);
    }
  }, [$userAddress]);

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          C.S.G. Art Gallery
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {!$userAddress ? (
            <li>
              <button className="btn btn-primary" onClick={connectMetaMask}>
                Conectar MetaMask
              </button>
            </li>
          ) : (
            <>
              <li>
                <span className="btn btn-secondary">
                  Conectado como: {$userAddress}
                </span>
              </li>
              <li>
                <button onClick={logOut} className="btn btn-secondary">
                  Cerrar Sesión
                </button>
              </li>
              <li>
                <a className="btn btn-accent" href="/mint">
                  Subir Obra
                </a>
              </li>
              <li>
                <a className="btn btn-error" href="/auctions">
                  Subastas
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
