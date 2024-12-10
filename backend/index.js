require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nft = require("./routes/nft");
const marketplace = require("./routes/marketplace");
const auction = require("./routes/auction");
const wallet = require("./routes/wallet");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:4321", // Astro Frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
  })
);

const PORT = process.env.PORT || 8008;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use("/api/nft", nft);
app.use("/api/marketplace", marketplace);
app.use("/api/auction", auction);
app.use("/api/wallet", wallet);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de la Galería de Arte!");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
