import User from "../models/user.model.js";
import {verifyToken} from "../utils/jwt.js";
import {ENV} from "../config/ENV.js";
import ApiError from "../utils/ApiError.js";

const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies[ENV.cookieName];
        if (!token) {
            throw ApiError.unauthorized("No token provided");
        }
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select("+password");
        if (!user) {
            throw ApiError.unauthorized("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError" || error.name === "JsonWebTokenError"){
            return next(ApiError.unauthorized("Invalid token"));
        }
        next(error);
    }
}
export default AuthMiddleware;
