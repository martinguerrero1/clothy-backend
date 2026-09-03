export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  console.log(error);
  res.status(statusCode).json({
    message: error.message || "Error interno del servidor",
    error,
  });
};
