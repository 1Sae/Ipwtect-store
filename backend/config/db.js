import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("IPW Tech connected to MongoDB");
    } catch (error) {
        console.log("Error in connecting to MongoDB", error);
        process.exit(1);
    }
};

export default connectDB;