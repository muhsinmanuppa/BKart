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

// CORS Configuration
app.use(cors({
  origin: [
    "https://b-kart.vercel.app", 
    "https://b-kart-server.vercel.app", 
    "http://localhost:5173",
    "https://b-kart-nine.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options('*', cors());

// Define routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("🟢 Server is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', err);
  res.status(500).json({ message: "Internal Server Error", details: err.message });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ API route not found!" });
});

// Connect to database & Start server
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully.");
    
    // Start the server only after DB is connected
    app.listen(5000, () => {
      console.log("🟢 Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

export default app;
