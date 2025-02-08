import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

// Get all products with optional filtering
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(error.kind === 'ObjectId' ? 400 : 500).json({ 
      message: error.kind === 'ObjectId' ? "Invalid product ID" : "Error fetching product", 
      error: error.message 
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, company, price, description } = req.body;

    const errors = [];
    if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters long");
    if (!category || category.trim().length < 2) errors.push("Category must be at least 2 characters long");
    if (!company || company.trim().length < 2) errors.push("Company must be at least 2 characters long");
    if (!price || isNaN(price) || price <= 0) errors.push("Invalid price");

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    let imageUrl = "https://res.cloudinary.com/dxtynhki3/image/upload/default-product.jpg";

    // If there's a file, upload to Cloudinary
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto"
      });
      imageUrl = uploadResult.secure_url;
    }

    const product = new Product({ 
      name, 
      category, 
      company, 
      price: parseFloat(price), 
      description: description || '', 
      image: imageUrl
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, company, price, description } = req.body;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const errors = [];
    if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters long");
    if (!category || category.trim().length < 2) errors.push("Category must be at least 2 characters long");
    if (!company || company.trim().length < 2) errors.push("Company must be at least 2 characters long");
    if (!price || isNaN(price) || price <= 0) errors.push("Invalid price");

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // If there's a new file, upload to Cloudinary
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto"
      });
      product.image = uploadResult.secure_url;
    }

    Object.assign(product, { 
      name, 
      category, 
      company, 
      price: parseFloat(price), 
      description: description || product.description 
    });
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    // If using Cloudinary and want to delete the image:
    if (product.image && !product.image.includes('default-product.jpg')) {
      // Extract public_id from Cloudinary URL if needed
      const publicId = product.image.split('/').slice(-1)[0].split('.')[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }
    
    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

export default { getProducts, getProductById, createProduct, updateProduct, deleteProduct };