import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export function authGuard(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "No tienes autorizacion para acceder a esto",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "No tienes autorizacion para acceder a esto",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "El token ha expirado",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}
