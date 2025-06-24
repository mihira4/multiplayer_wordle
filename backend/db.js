import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

// console.log("MONGO URI: ", process.env.MONGO_URI);
export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error(`Error in connecting: ${error}`);
        process.exit(1);
    }
}