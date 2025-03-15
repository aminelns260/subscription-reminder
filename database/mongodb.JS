import mongoose from "mongoose";

import { NODE_ENV, DB_URI } from "../config/env.js";

if (!DB_URI) {
    throw new Error("Please define the MongoDB_URI environment variable inside .env.<development/production>.local")
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);

        console.log(`Connected to DB in ${NODE_ENV} mode`);
    } catch (err) {
        console.log("Error connecting to Database: ", err);
        process.exit(1);
    }
}

export default connectToDatabase;