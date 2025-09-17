import express from "express";
import {
  crearMeta,
  obtenerMetas,
  actualizarMeta,
  eliminarMeta
} from "../controllers/metaController.js";

const router = express.Router();

router.post("/", crearMeta);
router.get("/", obtenerMetas);
router.put("/:id", actualizarMeta);
router.delete("/:id", eliminarMeta);

export default router;