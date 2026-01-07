import mongoose from "mongoose";
import { authConfig } from "../config/authConfig.js";

const databaseUrl = `mongodb://${authConfig.DB.HOST}:${authConfig.DB.PORT}/${authConfig.DB.NAME}`;

export const connectDB = async () => {
    try {
        await mongoose.connect(databaseUrl);
        console.log("MongoDB Connected Successfully.");
    } catch (err) {
        console.error(`MongoDB Connection Failed: ${err.message}`);
        process.exit(1);
    }
};
