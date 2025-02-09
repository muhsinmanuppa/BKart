import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();

let dbConnected = false; // Track DB connection status

// Middleware
app.use(express.json());
app.use(express.static("public"));

// ✅ Apply CORS Middleware before defining routes
const allowedOrigins = [
  "https://b-kart.vercel.app",
  "https://b-kart-server.vercel.app",
  "http://localhost:5173",
  "https://b-kart-nine.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Define routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Root Route - Show Server & DB Status
app.get("/", (req, res) => {
  res.json({
    message: "🟢 Server is running...",
    dbStatus: dbConnected ? "🟢 DB connected" : "❌ DB not connected"
  });
});

// ✅ Ensure CORS headers are sent in error responses
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', err);

  res.status(500).json({ 
    message: "Internal Server Error", 
    details: err.message 
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ API route not found!" });
});

// Connect to database
connectDB()
  .then(() => {
    dbConnected = true;
    console.log("✅ Database connected successfully.");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

// ✅ REMOVE `app.listen(5000, ...)` for Vercel
export default app;
