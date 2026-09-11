import ApiError from "../utils/ApiError";

const validate = (schema, source = "body") => (res, req, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        return next(ApiError.badRequest("Validation failed", details));
    }  
    req[source] = result.data;
    next();
}
export default validate;