import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs"; // Add this import

const router = express.Router();
const backendURL = process.env.BACKEND_URL || "http://localhost:5000";

// Ensure uploads directory exists
const ensureUploadDirectory = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirectory(); // Ensure directory exists
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, GIF, and WebP files are allowed."), false);
    }
    cb(null, true);
  },
}).single("image");

router.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      // Handle specific multer errors
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          message: err.code === 'LIMIT_FILE_SIZE' 
            ? "File is too large. Maximum size is 10MB." 
            : "Upload error" 
        });
      }
      // Handle other errors
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    res.json({ 
      imageUrl: `${backendURL}${imagePath}`,
      filename: req.file.filename
    });
  });
});

export default router;