import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to mongoDB: ${error.message}`)
        process.exit(1)
    }
}