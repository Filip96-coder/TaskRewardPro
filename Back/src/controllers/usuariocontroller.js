import Usuario from "../models/usuario.js";

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
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
