import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/product.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
  })
);

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
app.use("/api/products", productsRoutes);

export default app;
