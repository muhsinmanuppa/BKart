import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

cloudinary.config({
  cloud_name: "dxtynhki3",
  api_key: "233111839788775", 
  api_secret: "DKfTaIqFd7gvGQte7Osohys16Lk"
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, GIF, and WebP files allowed"), false);
    }
    cb(null, true);
  }
}).single("image");

router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto"
      });

      res.json({ 
        imageUrl: result.secure_url,
        publicId: result.public_id
      });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  });
});

export default router;