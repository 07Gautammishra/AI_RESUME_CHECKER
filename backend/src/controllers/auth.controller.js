import ApiError from "../utils/ApiError.js";
import {signToken, cookieOptions} from "../utils/jwt.js";
import {ENV} from "../config/ENV.js";
import User from "../models/user.model.js";

function issueSession(res, user) {
    const token = signToken(user._id);
    res.cookie(ENV.cookieName, token, cookieOptions);
}

const register = async (req, res) => {
    const {name, email, password} = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw ApiError.conflict("Email already in use");
    }

    const passwordHash = await User.hashPassword(password);
    const user = new User({name, email, password: passwordHash});
    await user.save();
    issueSession(res, user);
    res.status(201).json({user});
};

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    issueSession(res, user);
    res.status(200).json({user});
};

const logout = async (req, res) => {
    res.clearCookie(ENV.cookieName, cookieOptions);
    res.status(200).json({message: "Logged out successfully"});
};

const getCurrentUser = async (req, res) => {
    res.status(200).json({user: req.user});
};

const updateProfile = async (req, res) => {
    const {name} = req.body;
    req.user.name = name;
    await req.user.save();
    res.status(200).json({user: req.user});
};

const updatePassword = async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        throw ApiError.notFound("User not found");
    }
    if (!(await req.user.comparePassword(currentPassword))) {
        throw ApiError.unauthorized("Current password is incorrect");
    }

    req.user.password = await User.hashPassword(newPassword);
    await req.user.save();
    res.status(200).json({message: "Password updated successfully"});
};

export {register, login, logout, getCurrentUser, updateProfile, updatePassword};