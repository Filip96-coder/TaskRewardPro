import express from "express";
import {
  crearHistorialCanje,
  obtenerHistorialesCanje,
  actualizarHistorialCanje,
  eliminarHistorialCanje
} from "../controllers/historialCanjeController.js";

const router = express.Router();

router.post("/", crearHistorialCanje);
router.get("/", obtenerHistorialesCanje);
router.put("/:id", actualizarHistorialCanje);
router.delete("/:id", eliminarHistorialCanje);

export default router;