import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";

function sign(u) {
  return jwt.sign({ id: u._id, email: u.email,rol:u.rol }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  try {
    console.log("📩 Body recibido:", req.body); // 👈 ver qué llega del front

    const { name = "", email, password,rol } = req.body;
    if (!email || !password || !rol) return res.status(400).json({ message: "Email y password y rol son requeridos" });

    const exists = await Usuario.findOne({ email });
    if (exists) return res.status(409).json({ message: "El email ya está registrado" });

    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({ name, email, password: hash,rol, points: 0 });

    const token = sign(user);


    const safe = { id: user._id, name: user.name, email: user.email, rol: user.rol, points: user.points };
    res.status(201).json({ token, user: safe });
  } catch (e) {
    console.error("❌ Error en register:", e);
    res.status(500).json({ message: "Error registrando usuario" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = sign(user);
    const safe = { id: user._id, name: user.name, email: user.email, role: user.role, points: user.points };
    res.json({ token, user: safe });
  } catch {
    res.status(500).json({ message: "Error iniciando sesión" });
  }
}

export async function me(req, res) {
  try {
    const user = await Usuario.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Error obteniendo perfil" });
  }
}
