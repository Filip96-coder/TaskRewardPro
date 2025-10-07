import express from "express";
import {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea
} from "../controllers/tareaController.js";

import { authRequired } from "../middleware/auth.js";
import { requireRol } from "../middleware/rolmiddleware.js";

const router = express.Router();
router.get("/", authRequired,obtenerTareas);

router.post("/", authRequired, requireRol("Admin"), crearTarea);

router.put("/:id", authRequired, requireRol("Admin"), actualizarTarea);

router.delete("/:id", authRequired, requireRol("Admin"), eliminarTarea);

export default router;