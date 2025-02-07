import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // Import upload route


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads")); 
app.use(cors());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes); // Register upload route

app.get("/", (req, res) => {
    res.send("Server is running...");
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(cors({ origin: "*", credentials: true }));