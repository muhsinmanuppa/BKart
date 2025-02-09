import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const allowedOrigins = [
  process.env.CLIENT_URL, // Read from .env
  "http://localhost:3000" // Include localhost for development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));



connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("🟢 Server is running...");
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "❌ API route not found!" });
});

// Export for Vercel
export default app;
