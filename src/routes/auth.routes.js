import { Router } from "express";
import controller from "../controllers/auth.controllers.js";
import { authGuard } from "../middlewares/authGuard.js";

const router = Router();

router.get("/publico", (req, res) => {
  res.status(200).json({
    message: "Acceso permitido. Esta es una ruta pública.",
  });
});
router.get("/me", authGuard, controller.me);
router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;
