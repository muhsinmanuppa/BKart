import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js"; // Adjusted path
import productRoutes from "../routes/productRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import uploadRoutes from "../routes/uploadRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

// CORS Setup
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};
app.use(cors(corsOptions));

// Connect Database (Inside an Async Function)
(async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed", error);
    process.exit(1);
  }
})();

// Define routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("🟢 Server is running...");
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ API route not found!" });
});

// 🚀 Do not use `app.listen()` for Vercel
export default app;
