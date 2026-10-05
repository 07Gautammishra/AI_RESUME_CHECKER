import jwt from "jsonwebtoken";
import { ENV } from "../config/ENV.js";

const signToken = (id) => {
    return jwt.sign({ id }, ENV.jwtSecret, {
        expiresIn: '15d',
    });
}
const verifyToken = (token) => {
    return jwt.verify(token, ENV.jwtSecret);
}   
const cookieOptions = {
    httpOnly: true,
    secure: ENV.isProd, // Set to true in production
    sameSite: ENV.isProd ? 'none' : 'Lax', // Adjust based on your needs
    maxAge: 7 * 24 * 60 * 60 * 1000, 
};

export { signToken, cookieOptions , verifyToken};
