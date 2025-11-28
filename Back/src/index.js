import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import historialCanjeRoutes from "./routes/historialCanjeRoutes.js";
import recompensaRoutes from "./routes/recompensaRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
await connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/usuarios", usuarioRoutes);
app.use("/api/historial-canje", historialCanjeRoutes);
app.use("/api/recompensas", recompensaRoutes);
app.use("/api/metas", metaRoutes);
app.use("/api/rankings", rankingRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/tasks", tareaRoutes);
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")))

app.get("/health", (req,res) => res.json ({ok: true}));

const PORT = process.env.PORT || 4000;

app.use((req, res) => {
  console.log("❌ 404 ->", req.method, req.url);
  res.status(404).json({ msg: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
