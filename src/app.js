import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

//=======================
//ROUTES
//=======================

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

//Auth routes
app.use("/api/auth", authRoutes);

export default app;
