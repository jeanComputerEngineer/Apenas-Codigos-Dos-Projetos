import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mychat");
        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB", error);
        process.exit(1);
    }
};
