import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

const backendURL = process.env.BACKEND_URL || "http://localhost:5000";

// Utility function to format image URL
const formatImageURL = (imagePath) => {
  if (!imagePath) return "/uploads/default-product.jpg";
  return imagePath.startsWith("http") 
    ? imagePath 
    : `${backendURL}${imagePath}`;
};

// Utility function to remove old image files
const removeOldImage = (imagePath) => {
  if (imagePath && !imagePath.includes('default-product.jpg')) {
    const fullPath = path.resolve(process.cwd(), imagePath.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (error) {
        console.error("Error removing old image:", error);
      }
    }
  }
};

// Get all products
// Get all products with optional filtering
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Add category filter if provided
    if (category) {
      filter.category = category;
    }
    
    // Add search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Find products with filter
    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    res.json(products.map(product => ({
      ...product._doc,
      image: formatImageURL(product.image)
    })));
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ ...product._doc, image: formatImageURL(product.image) });
  } catch (error) {
    res.status(error.kind === 'ObjectId' ? 400 : 500).json({ message: error.kind === 'ObjectId' ? "Invalid product ID" : "Error fetching product", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, company, price, description, image } = req.body;

    const errors = [];
    if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters long");
    if (!category || category.trim().length < 2) errors.push("Category must be at least 2 characters long");
    if (!company || company.trim().length < 2) errors.push("Company must be at least 2 characters long");
    if (!price || isNaN(price) || price <= 0) errors.push("Invalid price");

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const productImage = image || "https://res.cloudinary.com/dxtynhki3/image/upload/default-product.jpg";

    const product = new Product({ 
      name, 
      category, 
      company, 
      price: parseFloat(price), 
      description: description || '', 
      image: productImage
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};
// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, company, price, description } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      if (req.file) removeOldImage(`/uploads/${req.file.filename}`);
      return res.status(404).json({ message: "Product not found" });
    }

    const errors = [];
    if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters long");
    if (!category || category.trim().length < 2) errors.push("Category must be at least 2 characters long");
    if (!company || company.trim().length < 2) errors.push("Company must be at least 2 characters long");
    if (!price || isNaN(price) || price <= 0) errors.push("Invalid price");

    if (errors.length > 0) {
      if (req.file) removeOldImage(`/uploads/${req.file.filename}`);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    if (req.file) {
      removeOldImage(product.image);
      product.image = `/uploads/${req.file.filename}`;
    }

    Object.assign(product, { name, category, company, price: parseFloat(price), description: description || product.description });
    res.json({ ...await product.save(), image: formatImageURL(product.image) });
  } catch (error) {
    if (req.file) removeOldImage(`/uploads/${req.file.filename}`);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    removeOldImage(product.image);
    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

export default { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
