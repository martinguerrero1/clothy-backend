import dotenv from "dotenv";
import app from "./app.js";
import conectarDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}\n`);
  });
});
