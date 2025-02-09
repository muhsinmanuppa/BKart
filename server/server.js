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

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Wait for DB connection before starting server
const startServer = async () => {
  try {
    await connectDB(); // Ensure DB is connected first
    console.log("✅ MongoDB Connected, Starting Server...");

    // Define routes after DB connection is ready
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
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });

    // Handle unknown routes
    app.use((req, res) => {
      res.status(404).json({ message: "❌ API route not found!" });
    });

    // 🔹 Start the server on the specified port
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
  }
};

startServer(); // Call function to start server

export default app;
