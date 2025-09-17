import express from "express";
import { actualizausuario, crearUsuario, eliminarusuario, obtenerUsuarios, obtenerPorRol } from "../controllers/usuariocontroller.js";

const router = express.Router();

router.post("/", crearUsuario);
router.get("/", obtenerUsuarios);
router.put("/:id", actualizausuario);
router.delete("/:id", eliminarusuario);
router.get("/rol/:rol", obtenerPorRol);

export default router;
