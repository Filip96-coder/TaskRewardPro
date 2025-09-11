import express from "express";
import { actualizausuario, crearUsuario, eliminarusuario, obtenerUsuarios } from "../controllers/usuariocontroller.js";

const router = express.Router();

router.post("/", crearUsuario);
router.get("/", obtenerUsuarios);
router.put("/:id", actualizausuario);
router.delete("/:id", eliminarusuario);


export default router;
