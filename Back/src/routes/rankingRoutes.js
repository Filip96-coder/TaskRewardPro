import express from "express";
import {
  crearRanking,
  obtenerRankings,
  actualizarRanking,
  eliminarRanking
} from "../controllers/rankingController.js";

const router = express.Router();

router.post("/", crearRanking);
router.get("/", obtenerRankings);
router.put("/:id", actualizarRanking);
router.delete("/:id", eliminarRanking);

export default router;