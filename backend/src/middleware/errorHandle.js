import ApiError from "../utils/ApiError.js";
import {ENV} from "../config/ENV.js";
const errorHandler = (err, req, res, next) => {
    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let details = err.details;

    // Handle ApiError instances (operational errors)
    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            ...(details && { details }),
        });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid or malformed token";
    }

    // Handle JWT expiration
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token has expired";
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 422;
        message = "Validation failed";
        details = Object.values(err.errors).map((error) => error.message);
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        statusCode = 409;
        message = `${field} already exists`;
        details = { field, value: err.keyValue[field] };
    }

    // Handle Mongoose cast errors (invalid ObjectId)
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    // Log unexpected errors
    if (!err.isOperational) {
        console.error("❌ Unexpected Error:", {
            name: err.name,
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });
    }

    // Send error response
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(details && { details }),
        ...(env.nodeEnv === "development" && { stack: err.stack }),
    });
};

/**
 * Not found middleware
 * Catches requests to undefined routes
 */
const notFound = (req, res, next) => {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

export { errorHandler, notFound };