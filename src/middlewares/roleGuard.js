export function roleGuard(req, res, next) {
  const userRole = req.user.role;

  if (userRole !== "admin") {
    const error = new Error("No estas autorizado para esa accion");
    error.statusCode = 403;

    return next(error);
  }

  next();
}
