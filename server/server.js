import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // Import upload route

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

// Enable CORS for all origins
app.use(cors({ origin: "*", credentials: true }));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes); // Register upload route

// Root route for health check
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Export app for Vercel (No need for app.listen in Serverless deployment)
export default app;
