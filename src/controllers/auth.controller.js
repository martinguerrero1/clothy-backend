import { registerUser, loginUser, getUser } from "../services/auth.service.js";

async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await loginUser(req.body);

    res.status(200).json({
      message: "Sesión iniciada correctamente",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await getUser(req.user.id);

    res.status(200).json({
      message: "Informacion del usuario logueado",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export default { register, login, me };
