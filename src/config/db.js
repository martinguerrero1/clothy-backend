import mongoose from "mongoose";
import "dotenv/config";

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log(`--------------------------------------`);
    console.log("✅ Base de datos conectada");
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`--------------------------------------`);
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB");
    console.error(error.message);

    process.exit(1);
  }
};

export default conectarDB;
