import ApiError from "../utils/ApiError.js";
import {ENV} from "../config/ENV.js";
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let details = err.details;

    if (err.name === "ValidationError" && err.errors) {
        // Handle Mongoose validation errors
        statusCode = 422;
        message = "Validation failed";
        details = Object.values(err.errors).map((error) => error.message);
    }
    else if (err.code === 11000) {
        // Handle Mongoose duplicate key error
        const field = Object.keys(err.keyValue)[0];
        statusCode = 409;
        message = `${field} already exists`;
        details = { field, value: err.keyValue[field] };
    } else if (err.name === "CastError") {
        // Handle Mongoose cast errors (invalid ObjectId)
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.name === "ZodError") {
        statusCode = 400;
        message = "Validation failed";
        details = err.issues;
    }

    // Log unexpected errors
    if (statusCode >= 500) {
        console.error(`[${req.method} ${req.originalUrl}]`, err);
    }

        // Send error response
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(details && { details }),
        ...(ENV.isProd ? {} : { stack: err.stack }),
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