import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function registerUser({ name, lastName, username, email, password }) {
  const normalizedName = name.trim();
  const normalizedLastName = lastName.trim();
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await UserModel.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("Ese email ya ha sido utilizado para registrar un usuario");
    error.statusCode = 409;

    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    name: normalizedName,
    lastName: normalizedLastName,
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const { password: _password, ...userWithoutPassword } = newUser.toObject();

  return userWithoutPassword;
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await UserModel.findOne({ email: normalizedEmail }).select("+password");
  if (!existingUser) {
    const error = new Error("Email o contraseña incorrectos");
    error.statusCode = 401;

    throw error;
  }

  const dbPassword = existingUser.password;
  const isValidPassword = await bcrypt.compare(password, dbPassword);
  if (!isValidPassword) {
    const error = new Error("Email o contraseña incorrectos");
    error.statusCode = 401;

    throw error;
  }

  const payload = {
    id: existingUser._id,
    username: existingUser.username,
    role: existingUser.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const { password: _password, ...userWithoutPassword } = existingUser.toObject();

  return {
    user: userWithoutPassword,
    token,
  };
}

export async function getUser(userId) {
  const user = await UserModel.findById(userId).select("id name lastName username email role");
  console.log(user);
  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;

    throw error;
  }

  return user;
}
