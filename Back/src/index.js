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

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/historial-canje", historialCanjeRoutes);
app.use("/api/recompensas", recompensaRoutes);
app.use("/api/metas", metaRoutes);
app.use("/api/rankings", rankingRoutes);
app.use("/api/tareas", tareaRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
