import { registerUser, loginUser, getUser } from "../services/auth.services.js";

async function register(req, res) {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { user, token } = await loginUser(req.body);

    res.status(200).json({
      message: "Sesión iniciada correctamente",
      user,
      token,
    });
  } catch (error) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
}

async function me(req, res) {
  try {
    const user = await getUser(req.user.id);

    res.status(200).json({
      message: "Informacion del usuario logueado",
      user,
    });
  } catch (error) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
}

export default { register, login, me };
