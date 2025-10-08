import express from "express";
import {crearTarea,obtenerTareas,actualizarTarea,eliminarTarea,obtenerTareasUsuario} from "../controllers/tareaController.js";
import { upload } from "../middleware/upload.js"
import {submitTask,listSubmissionsForTask,mySubmissionForTask,decideSubmission} from "../controllers/submissionController.js";
import { authRequired } from "../middleware/auth.js";
import { requireRol } from "../middleware/rolmiddleware.js";
import { claimPoints } from "../controllers/submissionController.js";

const router = express.Router();

router.get("/user/list",authRequired,requireRol("Trabajador"),obtenerTareasUsuario)

router.get("/", authRequired,obtenerTareas);

router.post("/", authRequired, requireRol("Admin"), crearTarea);

router.put("/:id", authRequired, requireRol("Admin"), actualizarTarea);

router.delete("/:id", authRequired, requireRol("Admin"), eliminarTarea);

router.post("/:id/submit", authRequired, requireRol("Trabajador"), upload.single("file"), submitTask)

router.get("/:id/submissions", authRequired, requireRol("Admin"), listSubmissionsForTask)

router.get("/:id/submission", authRequired, requireRol("Trabajador"), mySubmissionForTask)

router.patch("/:taskId/submission/:subId/decision", authRequired, requireRol("Admin"), decideSubmission)

router.post("/:taskId/claim", authRequired, requireRol("Trabajador"), claimPoints)

export default router;