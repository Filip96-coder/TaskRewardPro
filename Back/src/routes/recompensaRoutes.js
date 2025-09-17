import express from "express";
import {
  crearRecompensa,
  obtenerRecompensas,
  actualizarRecompensa,
  eliminarRecompensa
} from "../controllers/recompensaController.js";

const router = express.Router();

router.post("/", crearRecompensa);
router.get("/", obtenerRecompensas);
router.put("/:id", actualizarRecompensa);
router.delete("/:id", eliminarRecompensa);

export default router;