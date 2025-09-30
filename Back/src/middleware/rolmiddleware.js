export function requireRol(rol) {
    return (req, res, next) => {
      if (req.user.rol === rol) {
        return next();
      }
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    };
  }
  