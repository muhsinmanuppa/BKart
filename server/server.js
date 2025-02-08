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

// CORS Configuration
const corsOptions = {
  origin: ['https://client-six-ebon.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Root route for health check
app.get("/", (req, res) => {
  res.send("🟢 Server is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ API route not found!" });
});

// Add this for Vercel
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;