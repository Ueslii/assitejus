import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import casosRoutes from "./src/routes/casos.js";
import defensoresRoutes from "./src/routes/defensores.js";
import statusRoutes from "./src/routes/status.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/casos", casosRoutes);
app.use("/api/defensores", defensoresRoutes);
app.use("/api/status", statusRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Def. Sul Bahia API is running" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo deu errado no servidor!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
