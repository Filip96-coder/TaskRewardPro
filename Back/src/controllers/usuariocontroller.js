import Usuario from "../models/usuario.js";
import Lider from "../models/lider.js";
import Trabajador from "../models/trabajador.js";
import Admin from "../models/admin.js";

export const crearUsuario = async (req, res) => {
  try {
    let usuario;
    switch (req.body.rol) {
      case "Lider":
        usuario = new Lider(req.body);
        break;
      case "Trabajador":
        usuario = new Trabajador(req.body);
        break;
      case "Admin":
        usuario = new Admin(req.body);
        break;
      default:
        usuario = new Usuario(req.body);
    }
    const usuarioGuardado = await usuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear usuario", error });
  }
};

// Obtener usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios", error });
  }

};

export const actualizausuario = async (req, res) => {
    try {
      const usuarios = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true, 
      });
  
      if (!usuarios) return res.status(404).json({ error: "Usuario no encontrado" });
  
      res.json(usuarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  export const eliminarusuario = async (req, res) => {
    try {
      const usuarios = await Usuario.findByIdAndDelete(req.params.id);
  
      if (!usuarios) return res.status(404).json({ error: "Usuario no encontrado" });
  
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const obtenerPorRol = async (req, res) => {
  try {
    const { rol } = req.params;
    const usuarios = await Usuario.find({ rol });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios por rol", error });
  }
};