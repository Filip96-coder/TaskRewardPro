import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Falta MONGO_URI");
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error conectando a Mongo:", err.message);
    process.exit(1);
  }
}
