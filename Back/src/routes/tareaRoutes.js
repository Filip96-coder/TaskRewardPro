import express from "express";
import {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea
} from "../controllers/tareaController.js";

const router = express.Router();

router.post("/", crearTarea);
router.get("/", obtenerTareas);
router.put("/:id", actualizarTarea);
router.delete("/:id", eliminarTarea);

export default router;