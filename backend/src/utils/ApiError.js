class ApiError extends Error{
    constructor(statusCode, message, details){
        super(message);
        this.statusCode= statusCode;
        this.details= details;
        this.isOperational= true;
    }
    static badRequest(message, details){
        return new ApiError(400, message, details);
    }
    static unauthorized(message, details){
        return new ApiError(401, message, details);
    }
    static forbidden(message, details){
        return new ApiError(403, message, details);
    }
    static conflict(message, details){
        return new ApiError(409, message, details);
    }
    static notFound(message, details){
        return new ApiError(404, message, details);
    }
    static tooMany(message, details){
        return new ApiError(429, message, details);
    }
    static internal(){
        return new ApiError(500, "Internal server error");
    }
}

export default ApiError;