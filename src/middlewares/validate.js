export function validate(schema, property) {
  return (req, _res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return next(result.error);
    }

    next();
  };
}
