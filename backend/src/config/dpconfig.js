import mongoose from "mongoose";
import {ENV} from "./ENV.js";

const connectDB = async () => {
    try {
       const conn= await mongoose.connect(ENV.mongoUrl);
        // console.log('MongoDB connected on ', conn.connection.host);
    } catch (error) {
        console.log('Error in DB connection', error);
    }
}

export default connectDB;