import express from "express";
import cors from 'cors';
import connectDB from "./config/dpconfig.js";
import dotenv from "dotenv";
const app= express();
dotenv.config();


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.listen(PORT, async() => {
    await connectDB()
    console.log(`Server is running on http://localhost:${PORT}`);
});