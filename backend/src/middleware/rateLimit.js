const {rateLimit, ipKeyGenerator} = require("express-rate-limit");

const analyzeLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: "draft-7",
    legacyHeaders: false,  
    keyGenerator: (req, res)=>{
        req.user?.id ? req.user.id : ipKeyGenerator(req, res);
    },
    message:{
        error: {message:"Too many requests from this IP, please try again later."},
    } 
});
const authLimiter = rateLimit({
    windowMs: 15*60 * 1000,
    max: 20, // Limit each IP to 20 requests per windowMs
    standardHeaders: "draft-7",
    legacyHeaders: false,   
    keyGenerator: (req, res)=> ipKeyGenerator(req, res),
    message:{
        error: {message:"Too many auth attempts"},
    } 
});

export {analyzeLimiter, authLimiter};