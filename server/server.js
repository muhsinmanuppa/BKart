import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// CORS Configuration (Allowing Vercel & Localhost)
app.use(cors({
  origin: [
    "https://b-kart.vercel.app", 
    "https://b-kart-server.vercel.app", 
    "http://localhost:5173",
    "https://b-kart-nine.vercel.app"  // Add this line
  ],

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Define routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("🟢 Server is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ API route not found!" });
});

// Connect to database
connectDB()
  .then(() => console.log("✅ Database connected successfully."))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// 🚀 Export the app for Vercel (No need to use app.listen)
export default app;
