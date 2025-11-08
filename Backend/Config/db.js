import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const chatDbUrl = process.env.MONGODB_URL + "chatAppDB"; 
        await mongoose.connect(chatDbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ ChatApp DB connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
