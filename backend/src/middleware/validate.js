import ApiError from "../utils/ApiError.js";

const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    return next(ApiError.badRequest("Validation failed", result.error.issues));
  }

  if (source === "query" || source === "params") {
    // In Express, req.query and req.params have read-only getters.
    // Mutate existing keys instead of reassigning req[source].
    Object.keys(req[source]).forEach((key) => delete req[source][key]);
    Object.assign(req[source], result.data);
  } else {
    req[source] = result.data;
  }

  next();
};

export default validate;