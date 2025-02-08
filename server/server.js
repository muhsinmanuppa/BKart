import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // Import upload route

// Load environment variables
dotenv.config();
console.log("🟢 Environment variables loaded.");

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for frontend
const allowedOrigins = ["https://client-six-ebon.vercel.app"]; // Update with your frontend URL
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes); // Register upload route

// Root route for health check
app.get("/", (req, res) => {
  res.send("🟢 Server is running...");
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ API route not found!" });
});

// Export app for Vercel (No app.listen needed)
export default app;
