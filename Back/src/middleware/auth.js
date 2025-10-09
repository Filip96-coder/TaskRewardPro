import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const [, token] = hdr.split(" ");
    if (!token) return res.status(401).json({ message: "Token requerido" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
    